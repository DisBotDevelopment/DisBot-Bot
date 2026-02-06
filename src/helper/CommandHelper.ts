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
import {IDisBotCommand} from "../types/Interaction.js";
import {DisBotInteractionType} from "../enums/disBotInteractionType.js";

colors.enable();

export class CommandHelper {

    public static async loadCommandsForGuild(client: ExtendedClient, guildId: string) {

        Logger.info(`Starting Command loading for ${guildId}....`.gray.italic)

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

        const buildInCommandOverrides = await database.buildInCommands.findMany({
            where: {
                GuildCommandMangerId: guildId
            }
        })

        // TODO: ADD COMMAND_OVERWRITES

        Logger.info(`Sending commands to guild ${guildId} for client ${client.user.username}`);

        try {
            const commandReq = await fetch(`https://discord.com/api/v10/applications/${client.user.id}/guilds/${guildId}/commands`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bot ${Config.Bot.DiscordBotToken}`
                },
                body: JSON.stringify(cmdlist)
            })
            const data = await commandReq.json()
            console.log(JSON.stringify(data))

        } catch (e) {
            Logger.error(`Failed to load commands: ${e}`)
        }

        const ticketCommands = await database.ticketSetups.findMany({
            where: {
                GuildId: guildId
            }
        })

        if (ticketCommands.length > 0) {
            for (const ticketCommand of ticketCommands) {
                const clientGuild = await client.guilds.fetch(guildId);

                let guildCommand = null;
                try {
                    guildCommand = await clientGuild.commands.fetch(ticketCommand.SlashCommandId);
                } catch (e) {
                    Logger.error(`Failed to load commands: ${e}`)
                }

                if (!guildCommand) {
                    try {
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
                    } catch (e) {
                        Logger.error(`Failed to load commands: ${e}`)
                    }
                } else {
                    if (
                        guildCommand.name !== ticketCommand.SlashCommandName ||
                        guildCommand.description !== ticketCommand.SlashCommandDescription
                    ) {
                        try {
                            const updated = await guildCommand.edit({
                                name: ticketCommand.SlashCommandName ?? guildCommand.name,
                                description: ticketCommand.SlashCommandDescription ?? guildCommand.description,
                            });

                            await database.ticketSetups.update({
                                where: {CustomId: ticketCommand.CustomId},
                                data: {SlashCommandId: updated.id},
                            });
                        } catch (e) {
                            Logger.error(`Failed to load commands: ${e}`)
                        }
                    }
                }
            }
        }
        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "CommandHelper",
            message: `Discord added ${cmdlist.length} commands (${stats.subCommands} subCommands, ${stats.subCommandGroups} subCommandGroups), ${stats.userInstall} userInstall commands, ${stats.contextMenus} context menu commands from ${moduleDirectories.length} module(s) for ${guildId}`,
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
                            applicationcmdlist.push(module.default.data.toJSON());
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

                    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

                    let processedCount = 0;
                    let successCount = 0;
                    let errorCount = 0;
                    const BATCH_SIZE = 5;
                    const DELAY_MS = 3000; 

                    for (const guild of guildArray) {
                        try {
                            if (processedCount > 0 && processedCount % BATCH_SIZE === 0) {
                                await interaction.editReply({
                                    content: `-# 📡 Loading commands... (${processedCount}/${guilds.size}) - ⏸️ Waiting 3s...`
                                });
                                await delay(DELAY_MS);
                            }
                            
                            await CommandHelper.loadCommandsForGuild(client, guild.id);
                            successCount++;

                            if (processedCount % 3 === 0 || processedCount === guildArray.length - 1) {
                                await interaction.editReply({
                                    content: `-# 📡 Loading commands... (${processedCount + 1}/${guilds.size})`
                                });
                            }
                        } catch (error) {
                            errorCount++;
                            console.error(`Failed to load commands for guild ${guild.id}:`, error);
                        } finally {
                            processedCount++;
                        }
                    }

                    await interaction.editReply({
                        content: `-# ✅ Commands loaded for ${successCount}/${guilds.size} guild(s)${errorCount > 0 ? ` (${errorCount} failed)` : ''}`
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
}