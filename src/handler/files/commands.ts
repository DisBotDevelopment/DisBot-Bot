import colors from "colors";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { getFilesRecursively } from "../../helper/fileHelper.js";
import type { ExtendedClient } from "../../types/client.js";
import { Logger } from "../../main/logger.js";
import { LoggingAction } from "../../enums/loggingTypes.js";
import {Config} from "../../main/config.js";

colors.enable();

export async function loadCommands(client: ExtendedClient) {
    try {
        client.commands?.clear?.();
        client.subCommands?.clear?.();
        client.subCommandGroups?.clear?.();

        const modulesFolder = path.join(process.cwd(), ".build", "src", "modules");
        if (!fs.existsSync(modulesFolder)) {
            console.warn("Modules folder does not exist.".red);
            return;
        }

        // Alle Unterordner in modules/ durchsuchen
        const moduleDirectories = fs.readdirSync(modulesFolder, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const loadedStats = {
            commands: 0,
            contextMenus: 0,
            userInstall: 0,
            subCommands: 0,
            subCommandGroups: 0
        };

        for (const moduleDir of moduleDirectories) {
            const moduleCommandFolder = path.join(modulesFolder, moduleDir, "commands");

            if (!fs.existsSync(moduleCommandFolder)) {
                continue; // Skip if no command folder exists
            }

            const commandDirs = {
                commands: path.join(moduleCommandFolder),
                contextMenus: path.join(modulesFolder, moduleDir, "contextmenu"),
                subCommands: path.join(moduleCommandFolder, "subCommand"),
                userInstall: path.join(moduleCommandFolder, "userInstall"),
                userInstallSub: path.join(moduleCommandFolder, "userInstall", "subCommand"),
                subCommandGroups: path.join(moduleCommandFolder, "subCommandGroup"),
            };

            // Commands
            if (fs.existsSync(commandDirs.commands)) {
                const allCommandFiles = getFilesRecursively(commandDirs.commands, [".js"]);
                for (const filePath of allCommandFiles) {
                    const fileName = path.basename(filePath);
                    try {
                        const moduleUrl = pathToFileURL(filePath).href;
                        const commandModule = await import(moduleUrl);
                        if (!commandModule) continue;
                        const command = commandModule.default ?? commandModule;

                        if (!command.data && (command.subCommand || command.subCommandGroup)) {
                            continue;
                        }
                        if (!command.data?.name || !command.data?.description) {
                            console.error(`${fileName}`.yellow, `❗ FAILED`.red, "Missing name or description.");
                            continue;
                        }

                        client.commands?.set(command.data.name, command);
                        loadedStats.commands++;
                    } catch (error) {
                        console.error(`Failed to load command ${fileName} from ${moduleDir}:`.red, error);
                    }
                }
            }

            // Context Menus
            if (fs.existsSync(commandDirs.contextMenus)) {
                const contextMenuFiles = getFilesRecursively(commandDirs.contextMenus, [".js"]);
                for (const filePath of contextMenuFiles) {
                    const fileName = path.basename(filePath);
                    try {
                        const moduleUrl = pathToFileURL(filePath).href;
                        const contextMenuModule = await import(moduleUrl);
                        if (!contextMenuModule) continue;
                        const contextMenu = contextMenuModule.default ?? contextMenuModule;

                        if (!contextMenu.data?.name) {
                            console.error(`${fileName}`.yellow, `❗ FAILED`.red, "Missing name.");
                            continue;
                        }

                        client.commands?.set(contextMenu.data.name, contextMenu);
                        loadedStats.contextMenus++;
                    } catch (error) {
                        console.error(`Failed to load context menu ${fileName} from ${moduleDir}:`.red, error);
                    }
                }
            }

            // User Install Commands
            if (fs.existsSync(commandDirs.userInstall)) {
                const userInstallFiles = getFilesRecursively(commandDirs.userInstall, [".js"]);
                for (const filePath of userInstallFiles) {
                    const fileName = path.basename(filePath);
                    try {
                        const moduleUrl = pathToFileURL(filePath).href;
                        const userInstallModule = await import(moduleUrl);
                        if (!userInstallModule) continue;
                        const userInstall = userInstallModule.default ?? userInstallModule;

                        if (!userInstall.data && (userInstall.subCommand || userInstall.subCommandGroup)) {
                            continue;
                        }
                        if (!userInstall.data?.name || !userInstall.data?.description) {
                            console.error(`${fileName}`.yellow, `❗ FAILED`.red, "Missing name or description.");
                            continue;
                        }

                        client.commands?.set(userInstall.data.name, userInstall);
                        loadedStats.userInstall++;
                    } catch (error) {
                        console.error(`Failed to load user install ${fileName} from ${moduleDir}:`.red, error);
                    }
                }
            }

            // User Install Subcommands
            if (fs.existsSync(commandDirs.userInstallSub)) {
                const userInstallSubCommandFiles = getFilesRecursively(commandDirs.userInstallSub, [".js"]);
                for (const filePath of userInstallSubCommandFiles) {
                    const fileName = path.basename(filePath);
                    try {
                        const moduleUrl = pathToFileURL(filePath).href;
                        const subCommandModule = await import(moduleUrl);
                        if (!subCommandModule) continue;
                        const subCommand = subCommandModule.default ?? subCommandModule;

                        if (!subCommand.subCommand) {
                            console.error(`${fileName}`.yellow, `❗ FAILED`.red, "Missing subCommand.");
                            continue;
                        }

                        client.subCommands?.set(subCommand.subCommand, subCommand);
                        loadedStats.subCommands++;
                    } catch (error) {
                        console.error(`Failed to load user install subcommand ${fileName} from ${moduleDir}:`.red, error);
                    }
                }
            }

            // Subcommands
            if (fs.existsSync(commandDirs.subCommands)) {
                const subCommandFiles = getFilesRecursively(commandDirs.subCommands, [".js"]);
                for (const filePath of subCommandFiles) {
                    const fileName = path.basename(filePath);
                    try {
                        const moduleUrl = pathToFileURL(filePath).href;
                        const subCommandModule = await import(moduleUrl);
                        if (!subCommandModule) continue;
                        const subCommand = subCommandModule.default ?? subCommandModule;

                        if (!subCommand.subCommand) {
                            console.error(`${fileName}`.yellow, `❗ FAILED`.red, "Missing subCommand.");
                            continue;
                        }

                        client.subCommands?.set(subCommand.subCommand, subCommand);
                        loadedStats.subCommands++;
                    } catch (error) {
                        console.error(`Failed to load subcommand ${fileName} from ${moduleDir}:`.red, error);
                    }
                }
            }

            // Subcommand Groups
            if (fs.existsSync(commandDirs.subCommandGroups)) {
                const subCommandGroupFiles = getFilesRecursively(commandDirs.subCommandGroups, [".js"]);
                for (const filePath of subCommandGroupFiles) {
                    const fileName = path.basename(filePath);
                    try {
                        const moduleUrl = pathToFileURL(filePath).href;
                        const groupModule = await import(moduleUrl);
                        if (!groupModule) continue;
                        const group = groupModule.default ?? groupModule;

                        if (!group.subCommandGroup) {
                            console.error(`${fileName}`.yellow, `❗ FAILED`.red, "Missing subCommandGroup.");
                            continue;
                        }

                        client.subCommandGroups?.set(group.subCommandGroup, group);
                        loadedStats.subCommandGroups++;
                    } catch (error) {
                        console.error(`Failed to load subcommand group ${fileName} from ${moduleDir}:`.red, error);
                    }
                }
            }
        }

        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "CommandHandler",
            message: `Loaded ${loadedStats.commands} commands, ${loadedStats.contextMenus} context menus, ` +
                `${loadedStats.userInstall} user install, ${loadedStats.subCommands} subcommands, ${loadedStats.subCommandGroups} subcommand groups from ${moduleDirectories.length} module(s)`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Command,
        });
    } catch (error) {
        console.error("An error occurred while loading commands:".red, error);
        Logger.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "CommandHandler",
            message: `Error loading commands: ${error instanceof Error ? error.message : String(error)}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Command,
        });
    }
}