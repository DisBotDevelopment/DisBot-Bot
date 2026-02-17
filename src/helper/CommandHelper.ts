import colors from "colors";
import {ChatInputCommandInteraction, Guild, REST, Routes, SlashCommandBuilder} from "discord.js";
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
import type {IDisBotCommand} from "../types/Interaction.js";
import {DisBotInteractionType} from "../enums/disBotInteractionType.js";

colors.enable();

export class CommandHelper {

    public static async loadCommandsForGuild(client: ExtendedClient, guildId: string) {

        Logger.info(`Starting Command loading for ${guildId}....`.gray.italic)

        await this.addDefaultCommandsToGuild(client, guildId)

        let cmdlist: any[] = [];
        const stats = {
            commands: 0,
            contextMenus: 0,
            subCommands: 0,
            subCommandGroups: 0
        };

        const modulesFolder = path.join(process.cwd(), "src", "modules");
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
                subCommandGroups: path.join(moduleCommandFolder, "subCommandGroup"),
            };

            // Load main commands
            if (fs.existsSync(commandDirs.commands)) {
                const commandFiles = getFilesRecursively(commandDirs.commands, [".ts"]);

                for (const filePath of commandFiles) {
                    const relativePath = path.relative(commandDirs.commands, filePath);
                    if (relativePath.includes(path.sep)) {
                        continue;
                    }

                    try {
                        const module = await import(pathToFileURL(filePath).href);
                        if (module.default?.command) {
                            cmdlist.push(module.default.command.toJSON());
                            stats.commands++;
                        }
                    } catch (error) {
                        console.error(`Failed to load command from ${filePath}:`.red, error);
                    }
                }
            }

            // Load context menu commands
            if (fs.existsSync(commandDirs.contextMenus)) {
                const contextCommandFiles = getFilesRecursively(commandDirs.contextMenus, [".ts"]);
                for (const filePath of contextCommandFiles) {
                    try {
                        const module = await import(pathToFileURL(filePath).href);
                        if (module.default?.command) {
                            cmdlist.push(module.default.command.toJSON());
                            stats.contextMenus++;
                        }
                    } catch (error) {
                        console.error(`Failed to load context menu from ${filePath}:`.red, error);
                    }
                }
            }

            // Count subCommands and subCommandGroups (für Stats)
            if (fs.existsSync(commandDirs.subCommands)) {
                const subCommandFiles = getFilesRecursively(commandDirs.subCommands, [".ts"]);
                stats.subCommands += subCommandFiles.length;
            }

            if (fs.existsSync(commandDirs.subCommandGroups)) {
                const subCommandGroupFiles = getFilesRecursively(commandDirs.subCommandGroups, [".ts"]);
                stats.subCommandGroups += subCommandGroupFiles.length;
            }
        }

        if (!Config.Bot.DiscordApplicationId || !Config.Bot.DiscordBotToken) {
            throw new Error("Missing Config variables: DiscordApplicationId or DiscordBotToken");
        }

        const buildInCommandOverrides = await database.buildInCommands.findMany({
            where: {
                GuildCommandMangerId: guildId
            }
        })
        const commands = cmdlist
            .filter(cmd => {
                const override = buildInCommandOverrides.find(o => o.CodeName === cmd.name);
                return !(override && override.IsEnabled === false);
            })
            .map(cmd => {
                const override = buildInCommandOverrides.find(o => o.CodeName === cmd.name);
                if (override) {
                    return {
                        ...cmd,
                        name: override.CustomName.slice(0, 31),
                        description: override.Description?.slice(0, 99) ?? client.commands?.get(override.CodeName)?.command.description.slice(0, 99),
                        default_member_permissions: override.Permissions ?? client.commands?.get(override.CodeName)?.command.default_member_permissions
                    };
                }
                return cmd;
            })

        Logger.info(`Sending commands to guild ${guildId} for client ${client.user?.username}`);

        const restClient = new REST().setToken(Config.Bot.DiscordBotToken)
        const currentCommands = await (await client.guilds.fetch(guildId)).commands.fetch();

        for (const [commandId, command] of currentCommands) {
            try {
                const cmd = commands.find((c) => c.name === command.name);

                if (!cmd) {
                    await restClient.delete(
                        Routes.applicationGuildCommand(client.user.id, guildId, commandId)
                    );
                    Logger.info(`[CMD DELETE] Deleted command: ${command.name}`);
                } else {
                    if (Config.Commands.CommandsToUpdate.includes(command.name)) {
                        await restClient.patch(
                            Routes.applicationGuildCommand(client.user.id, guildId, commandId),
                            {body: cmd}
                        );
                        Logger.info(`[CMD UPDATE] Updated command: ${command.name}`);
                    }
                }
            } catch (e) {
                Logger.error(`[CMD] Failed to process command ${command.name}: ${e}`);
            }
        }

        for (const cmd of commands) {
            if (!currentCommands.some((c) => c.name === cmd.name)) {
                await restClient.post(
                    Routes.applicationGuildCommands(client.user.id, guildId),
                    {body: cmd}
                );
                Logger.info(`[CMD ADD] Added new command: ${cmd.name}`);
            }
        }

        const ticketCommands = await database.ticketSetups.findMany({
            where: {
                GuildId: guildId
            }
        })

        if (ticketCommands.length > 0) {
            for (const ticketCommand of ticketCommands) {
                try {
                    const clientGuild = await client.guilds.fetch(guildId);

                    if (!clientGuild || !ticketCommand || !ticketCommand.SlashCommandId) return

                    let guildCommand = null;
                    try {
                        guildCommand = await clientGuild.commands.fetch(ticketCommand.SlashCommandId);
                    } catch (e) {
                        Logger.error(`[TICKET] Failed to load commands: ${e}`)
                        return
                    }

                    let name = `open-${ticketCommand.CustomId.split("-")[0]}-ticket`
                    if (name.length >= 32 || (ticketCommand?.SlashCommandName && ticketCommand.SlashCommandName?.length >= 32)) {
                        return
                    } else if (ticketCommand.SlashCommandName.length <= 30) {
                        name = ticketCommand.SlashCommandName
                    }

                    let description = "Open Ticket with command."
                    if (ticketCommand && ticketCommand.SlashCommandDescription.length < 31) {
                        description = "Open Ticket with command."
                    } else if (guildCommand && guildCommand?.description < 99) {
                        description = guildCommand.description
                    }

                    if (!guildCommand) {
                        try {


                            guildCommand = await clientGuild.commands.create({
                                name: name,
                                description: description,
                            });

                            await database.ticketSetups.update({
                                where: {
                                    CustomId: ticketCommand.CustomId,
                                },
                                data: {
                                    SlashCommandId: guildCommand.id,
                                },
                            });
                        } catch (e) {
                            Logger.error(`[TICKET] Failed to load commands: ${e}`)
                            return
                        }
                    } else {
                        if (
                            guildCommand.name !== ticketCommand.SlashCommandName ||
                            guildCommand.description !== ticketCommand.SlashCommandDescription
                        ) {


                            try {
                                const updated = await guildCommand.edit({
                                    name: name,
                                    description: description,
                                });

                                await database.ticketSetups.update({
                                    where: {CustomId: ticketCommand.CustomId},
                                    data: {SlashCommandId: updated.id},
                                });
                            } catch (e) {
                                Logger.error(`[TICKET] Failed to load commands: ${e}`)
                                return
                            }
                        }
                    }
                } catch (e) {
                    return
                }
            }
        }

        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "CommandHelper",
            message: `Discord added ${cmdlist.length} commands (${stats.subCommands} subCommands, ${stats.subCommandGroups} subCommandGroups), ${stats.contextMenus} context menu commands from ${moduleDirectories.length} module(s) for ${guildId}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Command,
        });
    }

    public static async loadCommands(client: ExtendedClient) {
        let cmdlist: any[] = [];
        let applicationcmdlist: any[] = [];
        const stats = {
            commands: 0,
            userInstall: 0,
            contextMenus: 0,
            subCommands: 0,
            subCommandGroups: 0
        };

        const modulesFolder = path.join(process.cwd(), "src", "modules");
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
                const commandFiles = getFilesRecursively(commandDirs.commands, [".ts"]);

                for (const filePath of commandFiles) {
                    const relativePath = path.relative(commandDirs.commands, filePath);
                    if (relativePath.includes(path.sep)) {
                        continue;
                    }

                    try {
                        const module = await import(pathToFileURL(filePath).href);
                        if (module.default?.command) {
                            cmdlist.push(module.default.command.toJSON());
                            stats.commands++;
                        }
                    } catch (error) {
                        console.error(`Failed to load command from ${filePath}:`.red, error);
                    }
                }
            }

            // Load userInstall commands
            if (fs.existsSync(commandDirs.userInstall)) {
                const userCommandFiles = getFilesRecursively(commandDirs.userInstall, [".ts"]);
                for (const filePath of userCommandFiles) {
                    try {
                        const module = await import(pathToFileURL(filePath).href);
                        if (module.default?.command) {
                            applicationcmdlist.push(module.default.command.toJSON());
                            stats.userInstall++;
                        }
                    } catch (error) {
                        console.error(`Failed to load userInstall command from ${filePath}:`.red, error);
                    }
                }
            }

            // Load context menu commands
            if (fs.existsSync(commandDirs.contextMenus)) {
                const contextCommandFiles = getFilesRecursively(commandDirs.contextMenus, [".ts"]);
                for (const filePath of contextCommandFiles) {
                    try {
                        const module = await import(pathToFileURL(filePath).href);
                        if (module.default?.command) {
                            cmdlist.push(module.default.command.toJSON());
                            stats.contextMenus++;
                        }
                    } catch (error) {
                        console.error(`Failed to load context menu from ${filePath}:`.red, error);
                    }
                }
            }

            // Count subCommands and subCommandGroups (für Stats)
            if (fs.existsSync(commandDirs.subCommands)) {
                const subCommandFiles = getFilesRecursively(commandDirs.subCommands, [".ts"]);
                stats.subCommands += subCommandFiles.length;
            }

            if (fs.existsSync(commandDirs.subCommandGroups)) {
                const subCommandGroupFiles = getFilesRecursively(commandDirs.subCommandGroups, [".ts"]);
                stats.subCommandGroups += subCommandGroupFiles.length;
            }
        }

        if (!Config.Bot.DiscordApplicationId || !Config.Bot.DiscordBotToken) {
            throw new Error("Missing Config variables: DiscordApplicationId or DiscordBotToken");
        }

        const restClient = new REST().setToken(Config.Bot.DiscordBotToken);

        // Clear application command
        await restClient.put(Routes.applicationCommands(Config.Bot.DiscordApplicationId), {
            body: [],
        });

        await restClient.put(Routes.applicationCommands(Config.Bot.DiscordApplicationId), {
            body: applicationcmdlist,
        });

        Logger.info("Application Command Loaded")
        Logger.info(`Loading guild commands for ${client.guilds.cache.size} guilds...`)

        const guilds = await client.guilds.fetch()
        guilds.map(async (guild) => {
            await this.loadCommandsForGuild(client, guild.id)
        })
    }

    public static async loadCustomAdminCommands(client: ExtendedClient) {
        const guild = await client.guilds.fetch(Config.Bot.AdminGuildId)

        const commands = [
            {
                interactionName: "Load Guild Commands",
                type: DisBotInteractionType.Command,
                command: new SlashCommandBuilder()
                    .setName("loadcommands")
                    .setDescription("Load Commands for all Guilds."),
                execute: async (interaction: ChatInputCommandInteraction, client: ExtendedClient) => {
                    await interaction.deferReply();

                    const guilds = await client.guilds.fetch();
                    const guildArray = Array.from(guilds.values());

                    for (const guild of guildArray) {
                        try {
                            await CommandHelper.loadCommandsForGuild(client, guild.id);
                        } catch (error) {
                            console.error(`Failed to load commands for guild ${guild.id}:`, error);
                        } finally {
                            await this.addDefaultCommandsToGuild(client, guild.id)
                        }
                    }

                    await interaction.editReply({
                        content: `-# ✅ Commands loaded`
                    });
                }
            } as IDisBotCommand
        ]

        commands.map((commandData) => {
            client.guildCommands.set(commandData.command.name, commandData)
        })
        await guild.commands.set(
            commands.map((commandData) => commandData.command)
        )
    }

    public static async addDefaultCommandsToGuild(client: ExtendedClient, guildId: string) {
        // ADD /commands to GUILD
        await fetch(`https://discord.com/api/v10/applications/${client.user.id}/guilds/${guildId}/commands`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bot ${Config.Bot.DiscordBotToken}`
            },
            body: JSON.stringify(client.commands.get("commands").command)
        })
    }

}