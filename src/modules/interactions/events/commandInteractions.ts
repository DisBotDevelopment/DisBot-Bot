import { ChatInputCommandInteraction, Events, Guild, GuildMember, Interaction, } from "discord.js";
import { DisbotInteractionType } from "../../../enums/disbotInteractionType.js";
import { PermissionType } from "../../../enums/permissionType.js";
import { ExtendedClient } from "../../../types/client.js";
import { errorHandler } from "../../../helper/errorHelper.js";
import { InteractionHelper } from "../../../helper/InteractionHelper.js";
import { LoggingAction } from "../../../enums/loggingTypes.js";
import { Logger } from "../../../main/logger.js";
import {initUsersToDatabase} from "../../../helper/databaseHelper.js";
import {Config} from "../../../main/config.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
        try {
            if (!interaction.isCommand()) return;
            await initUsersToDatabase(client, interaction.user)

            const commandName = interaction.commandName;

            const subCommand = (interaction?.options as ChatInputCommandInteraction["options"])?.getSubcommand(false);
            const subCommandGroup = (interaction?.options as ChatInputCommandInteraction["options"])?.getSubcommandGroup(false);

            const command = client.commands?.get(commandName) ?? client.guildCommands?.get(commandName);
            const subCommandFile = client.subCommands?.get(`${commandName}.${subCommand}`) ?? client.guildSubCommands?.get(`${commandName}.${subCommand}`);
            const subCommandGroupFile = client.subCommandGroups?.get(`${commandName}.${subCommandGroup}.${subCommand}`);

            const activeHandler = subCommandGroupFile ?? subCommandFile ?? command;

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

            if (activeHandler?.options) {
                if ((activeHandler.options.cooldown ?? 0) >= 1) {
                    await InteractionHelper.cooldownCheck(
                        activeHandler.options.cooldown as number,
                        interaction,
                        client,
                        activeHandler.type as DisbotInteractionType
                    );
                }
                if ((activeHandler.options.botPermissions?.length ?? 0) > 0) {
                    await InteractionHelper.checkBotPermissions(
                        interaction,
                        client,
                        activeHandler.options.botPermissions
                    );
                }
                if (activeHandler.options.isGuildOwner) {
                    await InteractionHelper.checkGuildOwner(
                        interaction,
                        client,
                    );
                }
                if (!activeHandler.options.userHasOnePermission) {
                    if ((activeHandler.options.permission?.length ?? 0) > 0) {
                        await InteractionHelper.getPermissionType(
                            activeHandler.options.permission as PermissionType,
                            interaction.guild as Guild,
                            interaction.member as GuildMember,
                            client,
                            interaction
                        );
                    }
                    if ((activeHandler.options.userPermissions?.length ?? 0) > 0) {
                        await InteractionHelper.checkUserPermissions(
                            interaction,
                            client,
                            activeHandler.options.userPermissions
                        );
                    }
                } else {
                    if ((activeHandler.options.userPermissions?.length ?? 0) > 0) {
                        await InteractionHelper.checkUserHasOnePermission(
                            interaction,
                            activeHandler.options.userPermissions,
                            activeHandler.options.permission as PermissionType,
                        );
                    }
                }
            }

            // Execute command
            if (subCommandGroup && subCommandGroupFile) {
                return subCommandGroupFile.execute(interaction, client);
            } else if (subCommand && subCommandFile) {
                return subCommandFile.execute(interaction, client);
            } else {
                return command?.execute(interaction, client);
            }
        } catch (error) {
            errorHandler(interaction, client, error as Error);
        }
    },
};
