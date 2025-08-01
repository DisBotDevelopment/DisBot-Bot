import { getFilesRecursively } from "../../helper/fileHelper.js";
import type { ExtendedClient } from "../../types/client.js";
import colors from "colors";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { Logger } from "../../main/logger.js";
import { LoggingAction } from "../../enums/loggingTypes.js";
import {Config} from "../../main/config.js";

colors.enable();

export async function loadButtons(client: ExtendedClient): Promise<void> {
  try {
    client.buttons?.clear();

    const modulesFolder = path.join(process.cwd(), ".build", "src", "modules");
    if (!fs.existsSync(modulesFolder)) {
      console.warn("Modules folder does not exist.".red);
      return;
    }

    // Alle Unterordner in modules/ durchsuchen
    const moduleDirectories = fs.readdirSync(modulesFolder, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    let totalButtons = 0;

    for (const moduleDir of moduleDirectories) {
      const buttonFolder = path.join(modulesFolder, moduleDir, "buttons");

      if (!fs.existsSync(buttonFolder)) {
        continue; // Skip if no button folder exists
      }

      const buttonFiles = getFilesRecursively(buttonFolder, [".js"]);

      for (const filePath of buttonFiles) {
        const fileName = path.basename(filePath, path.extname(filePath));

        if (!fs.existsSync(filePath)) {
          console.error(`File not found: ${filePath}`.red);
          continue;
        }

        try {
          const fileUrl = pathToFileURL(filePath).href;
          const imported = await import(fileUrl);
          const button = imported.default ?? imported;

          if (!button.id) {
            console.error(`${fileName || "UNKNOWN"}`.yellow, "❗ FAILED".red, "Missing an id.");
            continue;
          }

          client.buttons?.set(button.id, button);
          totalButtons++;
        } catch (error) {
          Logger.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "ButtonHandler",
            message: `Failed to load button file: ${fileName || "UNKNOWN"} from module: ${moduleDir}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Button,
          });
          continue;
        }
      }
    }

    Logger.info({
      timestamp: new Date().toISOString(),
      level: "info",
      label: "ButtonHandler",
      message: `Loaded ${totalButtons} button(s) from ${moduleDirectories.length} module(s)`,
      botType: Config.BotType.toString() || "Unknown",
      action: LoggingAction.Button,
    });
  } catch (error) {
    Logger.error({
      timestamp: new Date().toISOString(),
      level: "error",
      label: "ButtonHandler",
      message: `Error loading buttons: ${error instanceof Error ? error.message : String(error)}`,
      botType: Config.BotType.toString() || "Unknown",
      action: LoggingAction.Button,
    });
  }
}