import {ButtonInteraction, Events, Guild, GuildMember,} from "discord.js";
import {Error} from "mongoose";
import {DisbotInteractionType} from "../../../enums/disbotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {ExtendedClient} from "../../../types/client.js";
import {errorHandler} from "../../../helper/errorHelper.js";
import {InteractionHelper} from "../../../helper/InteractionHelper.js";
import {Logger} from "../../../main/logger.js";
import {LoggingAction} from "../../../enums/loggingTypes.js";
import {initUsersToDatabase} from "../../../helper/databaseHelper.js";
import {Config} from "../../../main/config.js";
import {database} from "../../../main/database.js";

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

            if (buttonHandler?.options) {
                if ((buttonHandler.options.cooldown ?? 0) >= 1) {
                    await InteractionHelper.cooldownCheck(
                        buttonHandler.options.cooldown as number,
                        interaction,
                        client,
                        buttonHandler.type as DisbotInteractionType
                    );
                }
                if ((buttonHandler.options.botPermissions?.length ?? 0) > 0) {
                    await InteractionHelper.checkBotPermissions(
                        interaction,
                        client,
                        buttonHandler.options.botPermissions
                    );
                }
                if (buttonHandler.options.isGuildOwner) {
                    await InteractionHelper.checkGuildOwner(
                        interaction,
                        client,
                    );
                }
                if (!buttonHandler.options.userHasOnePermission) {
                    if ((buttonHandler.options.permission?.length ?? 0) > 0) {
                        await InteractionHelper.getPermissionType(
                            buttonHandler.options.permission as PermissionType,
                            interaction.guild as Guild,
                            interaction.member as GuildMember,
                            client,
                            interaction
                        );
                    }

                    if ((buttonHandler.options.userPermissions?.length ?? 0) > 0) {
                        await InteractionHelper.checkUserPermissions(
                            interaction,
                            client,
                            buttonHandler.options.userPermissions
                        );
                    }
                } else {
                    if ((buttonHandler.options.userPermissions?.length ?? 0) > 0) {
                        await InteractionHelper.checkUserHasOnePermission(
                            interaction,
                            buttonHandler.options.userPermissions,
                            buttonHandler.options.permission as PermissionType,
                        );
                    }
                }
            }
            await buttonHandler?.execute(interaction, client);
        } catch (error) {
            errorHandler(interaction, client, error as Error);
        }
    }
};
