import {ButtonInteraction, Events, Guild, GuildMember, MessageFlags,} from "discord.js";
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {GuildPermissionType, PermissionType} from "../../../enums/permissionType.js";
import {ExtendedClient} from "../../../types/client.js";
import {errorHandler} from "../../../helper/errorHelper.js";
import {InteractionHelper} from "../../../helper/InteractionHelper.js";
import {Logger} from "../../../main/logger.js";
import {LoggingAction} from "../../../enums/loggingTypes.js";
import {initUsersToDatabase} from "../../../helper/databaseHelper.js";
import {Config} from "../../../main/config.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    name: Events.InteractionCreate,

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!interaction.isButton()) return;
        await initUsersToDatabase(client, interaction.user)

        try {
            const {customId} = interaction;

            // Ignore Ticketbuttons
            const ticketData = await database.ticketSetups.findFirst({
                where: {
                    CustomId: customId
                }
            });
            if (ticketData) return;

            const buttonId = customId.split(":")[0];
            const buttonHandler = client.buttons?.get(buttonId);


            Logger.info(
                {
                    guildId: `${interaction.guild?.name} (${interaction.guildId})`,
                    userId: `${interaction.user.username} (${interaction.user.id})`,
                    channelId: `${interaction.channelId} (${interaction.channelId})`,
                    messageId: interaction.message.id || "N/A",
                    timestamp: new Date().toISOString(),
                    level: "info",
                    label: "Button Interaction",
                    message: [
                        `Button Interaction: ${buttonId}`,
                        `User: ${interaction.user.username} (${interaction.user.id})`,
                        `Channel: ${interaction.channelId}`,
                        `Guild: ${interaction.guild?.name} (${interaction.guildId})`,
                        `Message ID: ${interaction.message.id || "N/A"}`,
                        `Custom ID: ${interaction.customId}`,
                        `Bot Type: ${Config.BotType.toString() || "Unknown"}`,
                        `Action: ${LoggingAction.Button}`,
                        `Interaction ID: ${interaction.id}`,
                        `Interaction Type: ${interaction.type}`,
                    ].join("\n"),
                    botType: Config.BotType.toString() || "Unknown",
                    action: LoggingAction.Button,
                }
            );

            const interactionPermission = await database.guildInteractionPermissions.findFirst({
                where: {
                    GuildId: interaction.guildId,
                    CustomId: interaction.customId,
                    Type: GuildPermissionType.BUTTON
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

                const cooldownData = interactionPermission?.Cooldown ?? buttonHandler?.options?.cooldown ?? 0
                if (cooldownData) {
                    await InteractionHelper.cooldownCheck(
                        interactionPermission.Cooldown ?? buttonHandler.options.cooldown as number,
                        interaction,
                        client,
                        buttonHandler.type as DisBotInteractionType
                    );
                }
            }
            if ((buttonHandler?.options?.botPermissions?.length ?? 0) > 0) {
                await InteractionHelper.checkBotPermissions(
                    interaction,
                    client,
                    buttonHandler.options.botPermissions
                );
            }
            if (interactionPermission?.NeedsGuildOwner) {
                await InteractionHelper.checkGuildOwner(
                    interaction,
                    client,
                );
            } else if (buttonHandler?.options?.isGuildOwner && interactionPermission?.NeedsGuildOwner == null) {
                await InteractionHelper.checkGuildOwner(
                    interaction,
                    client,
                );
            }
            if ((buttonHandler?.options?.userPermissions?.length ?? 0) > 0 && !interactionPermission?.DisableInternalUserPermission) {
                await InteractionHelper.checkUserPermissions(
                    interaction,
                    client,
                    buttonHandler.options.userPermissions
                );
            }

            await buttonHandler?.execute(interaction, client);
        } catch (error) {
            errorHandler(interaction, client, error as Error);
        }
    }
};
