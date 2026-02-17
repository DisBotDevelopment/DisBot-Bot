import colors from "colors";
import fs from "fs";
import path from "path";
import {pathToFileURL} from "url";
import {getFilesRecursively} from "../../helper/fileHelper.js";
import {LoggingAction} from "../../enums/loggingTypes.js";
import {Logger} from "../../main/logger.js";
import {Config} from "../../main/config.js";
import {ExtendedClient} from "../../types/ExtendedClient.js";

colors.enable();

/**
 * @param {ExtendedClient} client
 */
export async function loadModals(client: ExtendedClient): Promise<void> {
    try {
        client.modals?.clear();

        const modulesFolder = path.join(process.cwd(), "src", "modules");
        if (!fs.existsSync(modulesFolder)) {
            console.warn("Modules folder does not exist.".red);
            return;
        }

        const moduleDirectories = fs.readdirSync(modulesFolder, {withFileTypes: true})
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        let totalModals = 0;

        for (const moduleDir of moduleDirectories) {
            const modalFolder = path.join(modulesFolder, moduleDir, "modals");

            if (!fs.existsSync(modalFolder)) {
                continue;
            }

            const modalFiles = getFilesRecursively(modalFolder, [".ts"]);

            for (const filePath of modalFiles) {
                const fileName = path.basename(filePath, path.extname(filePath));

                try {
                    const moduleUrl = pathToFileURL(filePath).href;
                    const modalModule = await import(moduleUrl);
                    const modal = modalModule.default ?? modalModule;

                    if (!modal.id && !modal.customId) {
                        console.error(`${fileName || "UNKNOWN"}`.yellow, `❗ FAILED`.red, "Missing an id.");
                        continue;
                    }

                    client.modals?.set(modal.id ?? modal.customId, modal);
                    totalModals++;
                } catch (error) {
                    Logger?.error({
                        timestamp: new Date().toISOString(),
                        level: "error",
                        label: "ModalHandler",
                        message: `Failed to load modal file: ${fileName || "UNKNOWN"} from module: ${moduleDir} with ${error}`,
                        botType: Config.BotType.toString() || "Unknown",
                        action: LoggingAction.Modal,
                    });
                    continue;
                }
            }
        }

        Logger?.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "ModalHandler",
            message: `Loaded ${totalModals} modal(s) from ${moduleDirectories.length} module(s)`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Modal,
        });
    } catch (error) {
        Logger?.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "ModalHandler",
            message: `Error loading modals: ${error instanceof Error ? error.message : String(error)}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Modal,
        });
    }
}