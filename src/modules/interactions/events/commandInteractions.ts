import {ChatInputCommandInteraction, Events, Guild, GuildMember, Interaction, MessageFlags,} from "discord.js";
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {GuildPermissionType, PermissionType} from "../../../enums/permissionType.js";
import {ExtendedClient} from "../../../types/client.js";
import {errorHandler} from "../../../helper/errorHelper.js";
import {InteractionHelper} from "../../../helper/InteractionHelper.js";
import {LoggingAction} from "../../../enums/loggingTypes.js";
import {Logger} from "../../../main/logger.js";
import {initUsersToDatabase} from "../../../helper/databaseHelper.js";
import {Config} from "../../../main/config.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
        try {
            if (!interaction.isCommand()) return;
            await initUsersToDatabase(client, interaction.user)

            const commandName = interaction.commandName;

            const buildInCommandOverrides = await database.buildInCommands.findFirst({
                where: {
                    GuildCommandMangerId: interaction.guild.id,
                    CustomName: commandName
                }
            })

            const subCommand = (interaction?.options as ChatInputCommandInteraction["options"])?.getSubcommand(false);
            const subCommandGroup = (interaction?.options as ChatInputCommandInteraction["options"])?.getSubcommandGroup(false);

            const codeName = buildInCommandOverrides ? buildInCommandOverrides.CodeName : commandName
            const command = client.commands?.get(codeName) ?? client.guildCommands?.get(commandName);
            const subCommandFile = client.subCommands?.get(`${codeName}.${subCommand}`) ?? client.guildSubCommands?.get(`${commandName}.${subCommand}`);
            const subCommandGroupFile = client.subCommandGroups?.get(`${codeName}.${subCommandGroup}.${subCommand}`);

            const activeHandler = subCommandGroupFile ?? subCommandFile ?? command;

            if (activeHandler) {
                Logger.info(
                    {
                        guildId: `${interaction.guild?.name} (${interaction.guildId})`,
                        userId: `${interaction.user.username} (${interaction.user.id})`,
                        channelId: `${interaction.channelId} (${interaction.channelId})`,
                        messageId: "N/A",
                        timestamp: new Date().toISOString(),
                        level: "info",
                        label: "Command Interaction",
                        message: [
                            `Command Interaction: ${interaction.commandName}`,
                            `User: ${interaction.user.username} (${interaction.user.id})`,
                            `Channel: ${interaction.channelId}`,
                            `Guild: ${interaction.guild?.name} (${interaction.guildId})`,
                            `Command ID: ${interaction.commandId}`,
                            `Bot Type: ${Config.BotType.toString() || "Unknown"}`,
                            `Action: ${LoggingAction.Command}`,
                            `Interaction ID: ${interaction.id}`,
                            `Interaction Type: ${interaction.type}`,
                        ].join("\n"),
                        botType: Config.BotType.toString() || "Unknown",
                        action: LoggingAction.Command,
                    }
                );

                if (interaction.inGuild()) {
                    const interactionPermission = await database.guildInteractionPermissions.findFirst({
                        where: {
                            GuildId: interaction.guildId,
                            CommandName: activeHandler?.data?.name ? activeHandler.data.name : activeHandler.subCommand ? activeHandler.subCommand : activeHandler.subCommandGroup,
                            Type: activeHandler?.data?.name ? GuildPermissionType.COMMAND : activeHandler.subCommand ? GuildPermissionType.SUBCOMMAND : GuildPermissionType.SUBCOMMANDGROUP
                        }
                    })

                    if (interactionPermission) {
                        const allowedToUse: boolean[] = []
                        if (interactionPermission?.UserIds.length >= 1) {
                            allowedToUse.push(await InteractionHelper.userRequirements(
                                    interaction,
                                    client,
                                    interactionPermission.UserIds
                                )
                            )
                        }
                        if (interactionPermission?.ChannelIds.length >= 1) {
                            if (await InteractionHelper.channelRequirements(
                                interaction,
                                client,
                                interactionPermission.ChannelIds
                            )) {
                                return await (interaction as any).reply({
                                    flags: MessageFlags.Ephemeral,
                                    content: `## ${await convertToEmojiPng("permission", client.user.id)} You can't perform this interaction!`
                                })
                            }
                        }
                        if (interactionPermission?.RoleIds.length >= 1) {
                            allowedToUse.push(await InteractionHelper.roleRequirements(
                                interaction,
                                client,
                                interactionPermission.RoleIds
                            ))
                        }
                        if (!allowedToUse.some((a) => a == true)) {
                            return await (interaction as any).reply({
                                flags: MessageFlags.Ephemeral,
                                content: `## ${await convertToEmojiPng("permission", client.user.id)} You can't perform this interaction!`
                            })
                        }

                        const cooldownData = interactionPermission?.Cooldown ?? activeHandler?.options?.cooldown ?? 0
                        if (cooldownData) {
                            await InteractionHelper.cooldownCheck(
                                interactionPermission.Cooldown ?? activeHandler.options.cooldown as number,
                                interaction,
                                client,
                                activeHandler.type as DisBotInteractionType
                            );
                        }
                    }
                    if ((activeHandler?.options?.botPermissions?.length ?? 0) > 0) {
                        await InteractionHelper.checkBotPermissions(
                            interaction,
                            client,
                            activeHandler.options.botPermissions
                        );
                    }
                    if (interactionPermission?.NeedsGuildOwner) {
                        await InteractionHelper.checkGuildOwner(
                            interaction,
                            client,
                        );
                    } else if (activeHandler?.options?.isGuildOwner && interactionPermission?.NeedsGuildOwner == null) {
                        await InteractionHelper.checkGuildOwner(
                            interaction,
                            client,
                        );
                    }
                    if ((activeHandler?.options?.userPermissions?.length ?? 0) > 0 && !interactionPermission?.DisableInternalUserPermission) {
                        await InteractionHelper.checkUserPermissions(
                            interaction,
                            client,
                            activeHandler.options.userPermissions
                        );
                    }
                }

                // Execute command
                if (subCommandGroup && subCommandGroupFile) {
                    return subCommandGroupFile.execute(interaction, client);
                } else if (subCommand && subCommandFile) {
                    return subCommandFile.execute(interaction, client);
                } else if (command) {
                    return command?.execute(interaction, client);
                } else {

                }
            }
        } catch (error) {
            errorHandler(interaction, client, error as Error);
        }
    },
};
