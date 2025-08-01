import colors from "colors";
import {REST, Routes} from "discord.js";
import fs from "fs";
import path from "path";
import {pathToFileURL} from "url";
import {ExtendedClient} from "../types/client.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import {getFilesRecursively} from "./fileHelper.js";
import {Logger} from "../main/logger.js";
import {Config} from "../main/config.js";

colors.enable();

export class CommandHelper {
    public static async loadCommands(client: ExtendedClient) {
        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "CommandHelper",
            message: `Loading commands for ${client.user?.displayName || "Unknown Bot"}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Command,
        });

        const cmdlist: any[] = [];
        const stats = {
            commands: 0,
            userInstall: 0,
            contextMenus: 0,
            subCommands: 0,
            subCommandGroups: 0
        };

        const modulesFolder = path.join(process.cwd(), ".build", "src", "modules");
        if (!fs.existsSync(modulesFolder)) {
            console.warn("Modules folder does not exist.".red);
            return;
        }

        // Alle Unterordner in modules/ durchsuchen
        const moduleDirectories = fs.readdirSync(modulesFolder, {withFileTypes: true})
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const moduleDir of moduleDirectories) {
            const moduleCommandFolder = path.join(modulesFolder, moduleDir, "commands");

            if (!fs.existsSync(moduleCommandFolder)) {
                continue; // Skip if no command folder exists
            }

            // Command Pfade für jedes Modul
            const commandDirs = {
                commands: moduleCommandFolder,
                contextMenus: path.join(modulesFolder, moduleDir, "contextmenu"),
                subCommands: path.join(moduleCommandFolder, "subCommand"),
                userInstall: path.join(moduleCommandFolder, "userInstall"),
                subCommandGroups: path.join(moduleCommandFolder, "subCommandGroup"),
            };

            // Load main commands
            if (fs.existsSync(commandDirs.commands)) {
                const commandFiles = getFilesRecursively(commandDirs.commands, [".js"]);

                for (const filePath of commandFiles) {
                    const relativePath = path.relative(commandDirs.commands, filePath);
                    if (relativePath.includes(path.sep)) {
                        continue;
                    }

                    try {
                        const module = await import(pathToFileURL(filePath).href);
                        if (module.default?.data) {
                            cmdlist.push(module.default.data.toJSON());
                            stats.commands++;
                        }
                    } catch (error) {
                        console.error(`Failed to load command from ${filePath}:`.red, error);
                    }
                }
            }

            // Load userInstall commands
            if (fs.existsSync(commandDirs.userInstall)) {
                const userCommandFiles = getFilesRecursively(commandDirs.userInstall, [".js"]);
                for (const filePath of userCommandFiles) {
                    try {
                        const module = await import(pathToFileURL(filePath).href);
                        if (module.default?.data) {
                            cmdlist.push(module.default.data.toJSON());
                            stats.userInstall++;
                        }
                    } catch (error) {
                        console.error(`Failed to load userInstall command from ${filePath}:`.red, error);
                    }
                }
            }

            // Load context menu commands
            if (fs.existsSync(commandDirs.contextMenus)) {
                const contextCommandFiles = getFilesRecursively(commandDirs.contextMenus, [".js"]);
                for (const filePath of contextCommandFiles) {
                    try {
                        const module = await import(pathToFileURL(filePath).href);
                        if (module.default?.data) {
                            cmdlist.push(module.default.data.toJSON());
                            stats.contextMenus++;
                        }
                    } catch (error) {
                        console.error(`Failed to load context menu from ${filePath}:`.red, error);
                    }
                }
            }

            // Count subCommands and subCommandGroups (für Stats)
            if (fs.existsSync(commandDirs.subCommands)) {
                const subCommandFiles = getFilesRecursively(commandDirs.subCommands, [".js"]);
                stats.subCommands += subCommandFiles.length;
            }

            if (fs.existsSync(commandDirs.subCommandGroups)) {
                const subCommandGroupFiles = getFilesRecursively(commandDirs.subCommandGroups, [".js"]);
                stats.subCommandGroups += subCommandGroupFiles.length;
            }
        }

        if (!Config.Bot.DiscordApplicationId || !Config.Bot.DiscordBotToken) {
            throw new Error("Missing environment variables: APPLICATIONID or TOKEN");
        }

        const restClient = new REST({version: "10"}).setToken(Config.Bot.DiscordBotToken);

        try {
            await restClient.put(Routes.applicationCommands(Config.Bot.DiscordApplicationId), {
                body: cmdlist,
            });

            Logger.info({
                timestamp: new Date().toISOString(),
                level: "info",
                label: "CommandHelper",
                message: `Discord added ${cmdlist.length} commands (${stats.subCommands} subCommands, ${stats.subCommandGroups} subCommandGroups), ${stats.userInstall} userInstall commands, ${stats.contextMenus} context menu commands from ${moduleDirectories.length} module(s)`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Command,
            });
        } catch (err) {
            Logger.error({
                timestamp: new Date().toISOString(),
                level: "error",
                label: "CommandHelper",
                message: `Failed to load commands: ${err instanceof Error ? err : String(err)}`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Command,
            });
        }
    }

    public static async guildLoadCommands(client: ExtendedClient) {
        const cmdlist: any[] = [];

        const commandFiles = fs
            .readdirSync(path.join(process.cwd(), ".build", "src", "internal", "commands"))
            .filter(file => file.endsWith(".js"));

        const subCommandFiles = fs
            .readdirSync(path.join(process.cwd(), ".build", "src", "internal", "commands", "subCommand"))
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const fullPath = path.join(process.cwd(), ".build", "src", "internal", "commands", file);
            const module = await import(pathToFileURL(fullPath).href);
            cmdlist.push(module.default.data.toJSON());
        }

        if (!Config.Bot.DiscordApplicationId || !Config.Bot.DiscordBotToken || !Config.Bot.AdminGuildId) {
            console.warn("[GUILD] Skipped guild command registration – missing env variables.".yellow);
            return;
        }

        const restClient = new REST({version: "10"}).setToken(Config.Bot.DiscordBotToken);

        try {
            await restClient.put(
                Routes.applicationGuildCommands(Config.Bot.DiscordApplicationId, Config.Bot.AdminGuildId),
                {body: cmdlist}
            );

            Logger.info({
                timestamp: new Date().toISOString(),
                level: "info",
                label: "CommandHelper",
                message: `Discord added ${cmdlist.length} guild commands (${subCommandFiles.length} subCommands)`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Command,
            });
        } catch (err) {
            Logger.error({
                timestamp: new Date().toISOString(),
                level: "error",
                label: "CommandHelper",
                message: `Failed to load guild commands: ${err instanceof Error ? err.message : String(err)}`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Command,
            });
        }
    }
}