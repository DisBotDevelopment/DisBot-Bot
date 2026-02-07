import {Events, Guild, GuildMember, InteractionType, MessageFlags, ModalSubmitInteraction,} from "discord.js";
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {GuildPermissionType, PermissionType} from "../../../enums/permissionType.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {errorHandler} from "../../../helper/errorHelper.js";
import {InteractionHelper} from "../../../helper/InteractionHelper.js";
import {LoggingAction} from "../../../enums/loggingTypes.js";
import {Logger} from "../../../main/logger.js";
import {initUsersToDatabase} from "../../../helper/databaseHelper.js";
import {Config} from "../../../main/config.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

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

            if (interaction.inGuild()) {
                const activeHandler = modal
                const interactionPermission = await database.guildInteractionPermissions.findFirst({
                    where: {
                        GuildId: interaction.guildId,
                        CustomId: interaction.customId,
                        Type: GuildPermissionType.MODAL
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
                                content: `## ${await convertToEmojiToPng("permission")} You can't perform this interaction!`
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
                            content: `## ${await convertToEmojiToPng("permission")} You can't perform this interaction!`
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

            return await modal?.execute(interaction, client);
        } catch (error) {
            errorHandler(interaction, client, error as Error);
        }
    },
};
