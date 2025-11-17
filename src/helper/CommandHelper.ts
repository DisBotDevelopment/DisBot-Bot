import colors from "colors";
import {Guild, REST, Routes} from "discord.js";
import fs from "fs";
import path from "path";
import {pathToFileURL} from "url";
import {ExtendedClient} from "../types/ExtendedClient.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import {getFilesRecursively} from "./fileHelper.js";
import {Logger} from "../main/logger.js";
import {Config} from "../main/config.js";
import {database} from "../main/database.js";
import {cli} from "winston/lib/winston/config/index.js";

colors.enable();

export class CommandHelper {

    public static async loadCommandsForGuild(client: ExtendedClient, guild: Guild) {

        let cmdlist: any[] = [];
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

        const moduleDirectories = fs.readdirSync(modulesFolder, {withFileTypes: true})
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const moduleDir of moduleDirectories) {
            const moduleCommandFolder = path.join(modulesFolder, moduleDir, "commands");

            if (!fs.existsSync(moduleCommandFolder)) {
                continue
            }

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
            throw new Error("Missing Config variables: DiscordApplicationId or DiscordBotToken");
        }

        const restClient = new REST({version: "10"}).setToken(Config.Bot.DiscordBotToken);

        // Clear application command
        await restClient.put(Routes.applicationCommands(Config.Bot.DiscordApplicationId), {
            body: [],
        });

        const buildInCommandOverrides = await database.buildInCommands.findMany({
            where: {
                GuildCommandMangerId: guild.id
            }
        })
        try {
            cmdlist = cmdlist
                .filter(cmd => {
                    const override = buildInCommandOverrides.find(o => o.CodeName === cmd.name);
                    return !(override && override.IsEnabled === false);
                })
                .map(cmd => {
                    const override = buildInCommandOverrides.find(o => o.CodeName === cmd.name);
                    if (override) {
                        return {
                            ...cmd,
                            name: override.CustomName,
                            description: override.Description ?? client.commands.get(override.CodeName).command.description,
                            default_member_permissions: override.Permissions ?? client.commands.get(override.CodeName).command.default_member_permissions
                        };
                    }
                    return cmd;
                })

            await restClient.put(Routes.applicationGuildCommands(Config.Bot.DiscordApplicationId, guild.id), {
                body: cmdlist,
            });

            const ticketCommands = await database.ticketSetups.findMany({
                where: {
                    GuildId: guild.id
                }
            })

            for (const ticketCommand of ticketCommands) {
                const clientGuild = await client.guilds.fetch(guild.id);

                let guildCommand = null;
                try {
                    guildCommand = await clientGuild.commands.fetch(ticketCommand.SlashCommandId);
                } catch {
                }

                if (!guildCommand) {
                    guildCommand = await clientGuild.commands.create({
                        name: ticketCommand.SlashCommandName ?? `open-${ticketCommand.CustomId}-ticket`,
                        description: ticketCommand.SlashCommandDescription ?? ticketCommand.CustomId,
                    });

                    await database.ticketSetups.update({
                        where: {
                            CustomId: ticketCommand.CustomId,
                        },
                        data: {
                            SlashCommandId: guildCommand.id,
                        },
                    });
                } else {
                    if (
                        guildCommand.name !== ticketCommand.SlashCommandName ||
                        guildCommand.description !== ticketCommand.SlashCommandDescription
                    ) {
                        const updated = await guildCommand.edit({
                            name: ticketCommand.SlashCommandName ?? guildCommand.name,
                            description: ticketCommand.SlashCommandDescription ?? guildCommand.description,
                        });

                        await database.ticketSetups.update({
                            where: {CustomId: ticketCommand.CustomId},
                            data: {SlashCommandId: updated.id},
                        });
                    }
                }
            }
        } catch (e) {
            Logger.error({
                timestamp: new Date().toISOString(),
                level: "error",
                label: "CommandHelper",
                message: `Command loading failed with error: ${e} - Commands failed at ${cmdlist.map((c) => c.name)} commands on Guild \"${guild.name}\" (${guild.id})`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Command,
            });
        }

        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "CommandHelper",
            message: `Discord added ${cmdlist.length} commands (${stats.subCommands} subCommands, ${stats.subCommandGroups} subCommandGroups), ${stats.userInstall} userInstall commands, ${stats.contextMenus} context menu commands from ${moduleDirectories.length} module(s) for \"${guild.name}\" (${guild.id})`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Command,
        });
    }

    public static async loadCommands(client: ExtendedClient) {
        let cmdlist: any[] = [];
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

        const moduleDirectories = fs.readdirSync(modulesFolder, {withFileTypes: true})
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const moduleDir of moduleDirectories) {
            const moduleCommandFolder = path.join(modulesFolder, moduleDir, "commands");

            if (!fs.existsSync(moduleCommandFolder)) {
                continue
            }

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
            throw new Error("Missing Config variables: DiscordApplicationId or DiscordBotToken");
        }

        const restClient = new REST({version: "10"}).setToken(Config.Bot.DiscordBotToken);

        // Clear application command
        await restClient.put(Routes.applicationCommands(Config.Bot.DiscordApplicationId), {
            body: [],
        });


        const allGuilds = await client.guilds.fetch();
        for (const guild of allGuilds.values()) {
            const buildInCommandOverrides = await database.buildInCommands.findMany({
                where: {
                    GuildCommandMangerId: guild.id
                }
            })
            try {
                cmdlist = cmdlist
                    .filter(cmd => {
                        const override = buildInCommandOverrides.find(o => o.CodeName === cmd.name);
                        return !(override && override.IsEnabled === false);
                    })
                    .map(cmd => {
                        const override = buildInCommandOverrides.find(o => o.CodeName === cmd.name);
                        if (override) {
                            return {
                                ...cmd,
                                name: override.CustomName,
                                description: override.Description ?? client.commands.get(override.CodeName).command.description,
                                default_member_permissions: override.Permissions ?? client.commands.get(override.CodeName).command.default_member_permissions
                            };
                        }
                        return cmd;
                    })

                await restClient.put(Routes.applicationGuildCommands(Config.Bot.DiscordApplicationId, guild.id), {
                    body: cmdlist,
                });

                const ticketCommands = await database.ticketSetups.findMany({
                    where: {
                        GuildId: guild.id
                    }
                })

                for (const ticketCommand of ticketCommands) {
                    const clientGuild = await client.guilds.fetch(guild.id);

                    let guildCommand = null;
                    try {
                        guildCommand = await clientGuild.commands.fetch(ticketCommand.SlashCommandId);
                    } catch {
                    }

                    if (!guildCommand) {
                        guildCommand = await clientGuild.commands.create({
                            name: ticketCommand.SlashCommandName ?? `open-${ticketCommand.CustomId}-ticket`,
                            description: ticketCommand.SlashCommandDescription ?? ticketCommand.CustomId,
                        });

                        await database.ticketSetups.update({
                            where: {
                                CustomId: ticketCommand.CustomId,
                            },
                            data: {
                                SlashCommandId: guildCommand.id,
                            },
                        });
                    } else {
                        if (
                            guildCommand.name !== ticketCommand.SlashCommandName ||
                            guildCommand.description !== ticketCommand.SlashCommandDescription
                        ) {
                            const updated = await guildCommand.edit({
                                name: ticketCommand.SlashCommandName ?? guildCommand.name,
                                description: ticketCommand.SlashCommandDescription ?? guildCommand.description,
                            });

                            await database.ticketSetups.update({
                                where: {CustomId: ticketCommand.CustomId},
                                data: {SlashCommandId: updated.id},
                            });
                        }
                    }
                }

            } catch (e) {
                Logger.error({
                    timestamp: new Date().toISOString(),
                    level: "error",
                    label: "CommandHelper",
                    message: `Command loading failed with error: ${e} - Commands failed at ${cmdlist.map((c) => c.name)} commands on Guild \"${guild.name}\" (${guild.id})`,
                    botType: Config.BotType.toString() || "Unknown",
                    action: LoggingAction.Command,
                });
            }

            Logger.info({
                timestamp: new Date().toISOString(),
                level: "info",
                label: "CommandHelper",
                message: `Discord added ${cmdlist.length} commands (${stats.subCommands} subCommands, ${stats.subCommandGroups} subCommandGroups), ${stats.userInstall} userInstall commands, ${stats.contextMenus} context menu commands from ${moduleDirectories.length} module(s) for \"${guild.name}\" (${guild.id})`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Command,
            });
        }
    }
}