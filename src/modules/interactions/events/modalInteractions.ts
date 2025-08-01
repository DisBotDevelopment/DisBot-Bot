import { Events, Guild, GuildMember, InteractionType, ModalSubmitInteraction, } from "discord.js";
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
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            if (!interaction.isModalSubmit()) return;
            await initUsersToDatabase(client, interaction.user)

            if (interaction.type !== InteractionType.ModalSubmit || !client.modals) return;

            const modalKey = interaction.customId.split(":")[0];
            const modal = client.modals.get(modalKey);

            Logger.info(
                {
                    guildId: `${interaction.guild?.name} (${interaction.guildId})`,
                    userId: `${interaction.user.username} (${interaction.user.id})`,
                    channelId: `${interaction.channelId} (${interaction.channelId})`,
                    messageId: interaction.message?.id || "N/A",
                    timestamp: new Date().toISOString(),
                    level: "info",
                    label: "Modal Interaction",
                    message: [
                        `Button Interaction: ${interaction.customId}`,
                        `User: ${interaction.user.username} (${interaction.user.id})`,
                        `Channel: ${interaction.channelId}`,
                        `Guild: ${interaction.guild?.name} (${interaction.guildId})`,
                        `Message ID: ${interaction.message?.id || "N/A"}`,
                        `Custom ID: ${interaction.customId}`,
                        `Bot Type: ${Config.BotType.toString() || "Unknown"}`,
                        `Action: ${LoggingAction.Modal}`,
                        `Interaction ID: ${interaction.id}`,
                        `Interaction Type: ${interaction.type}`,
                    ].join("\n"),
                    botType: Config.BotType.toString() || "Unknown",
                    action: LoggingAction.Modal,
                }
            );

            if (modal?.options) {
                if ((modal.options.cooldown ?? 0) >= 1) {
                    await InteractionHelper.cooldownCheck(
                        modal.options.cooldown as number,
                        interaction,
                        client,
                        modal.type as DisbotInteractionType
                    );
                }
                if ((modal.options.botPermissions?.length ?? 0) > 0) {
                    await InteractionHelper.checkBotPermissions(
                        interaction,
                        client,
                        modal.options.botPermissions
                    );
                }
                if (modal.options.isGuildOwner) {
                    await InteractionHelper.checkGuildOwner(
                        interaction,
                        client,
                    );
                }
                if (!modal.options.userHasOnePermission) {
                    if ((modal.options.permission?.length ?? 0) > 0) {
                        await InteractionHelper.getPermissionType(
                            modal.options.permission as PermissionType,
                            interaction.guild as Guild,
                            interaction.member as GuildMember,
                            client,
                            interaction
                        );
                    }
                    if ((modal.options.userPermissions?.length ?? 0) > 0) {
                        await InteractionHelper.checkUserPermissions(
                            interaction,
                            client,
                            modal.options.userPermissions
                        );
                    }
                } else {
                    if ((modal.options.userPermissions?.length ?? 0) > 0) {
                        await InteractionHelper.checkUserHasOnePermission(
                            interaction,
                            modal.options.userPermissions,
                            modal.options.permission as PermissionType,
                        );
                    }
                }
            }

            return await modal?.execute(interaction, client);
        } catch (error) {
            errorHandler(interaction, client, error as Error);
        }
    },
};
