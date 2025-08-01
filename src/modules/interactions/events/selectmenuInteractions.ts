import {AnySelectMenuInteraction, Events, Guild, GuildMember,} from "discord.js";
import {DisbotInteractionType} from "../../../enums/disbotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {ExtendedClient} from "../../../types/client.js";
import {errorHandler} from "../../../helper/errorHelper.js";
import {InteractionHelper} from "../../../helper/InteractionHelper.js";
import {Logger} from "../../../main/logger.js";
import {LoggingAction} from "../../../enums/loggingTypes.js";
import {initUsersToDatabase} from "../../../helper/databaseHelper.js";
import {Config} from "../../../main/config.js";

export default {
    name: Events.InteractionCreate,

    /**
     * @param {AnySelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: AnySelectMenuInteraction,
        client: ExtendedClient
    ) {

        try {
            if (!interaction.isAnySelectMenu()) return;
            await initUsersToDatabase(client, interaction.user)

            // Selectmenu Handling
            const selectId = interaction.customId.split(":")[0];
            const selectmenu = client.selectmenus?.get(selectId);

            Logger.info(
                {
                    guildId: `${interaction.guild?.name} (${interaction.guildId})`,
                    userId: `${interaction.user.username} (${interaction.user.id})`,
                    channelId: `${interaction.channelId} (${interaction.channelId})`,
                    messageId: interaction.message?.id || "N/A",
                    timestamp: new Date().toISOString(),
                    level: "info",
                    label: "SelectMenu Interaction",
                    message: [
                        `Button Interaction: ${interaction.customId}`,
                        `User: ${interaction.user.username} (${interaction.user.id})`,
                        `Channel: ${interaction.channelId}`,
                        `Guild: ${interaction.guild?.name} (${interaction.guildId})`,
                        `Message ID: ${interaction.message?.id || "N/A"}`,
                        `Custom ID: ${interaction.customId}`,
                        `Bot Type: ${Config.BotType.toString() || "Unknown"}`,
                        `Action: ${LoggingAction.SelectMenu}`,
                        `Interaction ID: ${interaction.id}`,
                        `Interaction Type: ${interaction.type}`,
                    ].join("\n"),
                    botType: Config.BotType.toString() || "Unknown",
                    action: LoggingAction.SelectMenu,
                }
            );

            if (selectmenu?.options) {
                if ((selectmenu.options.cooldown ?? 0) >= 1) {
                    await InteractionHelper.cooldownCheck(
                        selectmenu.options.cooldown as number,
                        interaction,
                        client,
                        selectmenu.type as DisbotInteractionType
                    );
                }
                if ((selectmenu.options.botPermissions?.length ?? 0) > 0) {
                    await InteractionHelper.checkBotPermissions(
                        interaction,
                        client,
                        selectmenu.options.botPermissions
                    );
                }
                if (selectmenu.options.isGuildOwner) {
                    await InteractionHelper.checkGuildOwner(
                        interaction,
                        client,
                    );
                }
                if (!selectmenu.options.userHasOnePermission) {
                    if ((selectmenu.options.permission?.length ?? 0) > 0) {
                        await InteractionHelper.getPermissionType(
                            selectmenu.options.permission as PermissionType,
                            interaction.guild as Guild,
                            interaction.member as GuildMember,
                            client,
                            interaction
                        );
                    }
                    if ((selectmenu.options.userPermissions?.length ?? 0) > 0) {
                        await InteractionHelper.checkUserPermissions(
                            interaction,
                            client,
                            selectmenu.options.userPermissions
                        );
                    }
                } else {
                    if ((selectmenu.options.userPermissions?.length ?? 0) > 0) {
                        await InteractionHelper.checkUserHasOnePermission(
                            interaction,
                            selectmenu.options.userPermissions,
                            selectmenu.options.permission as PermissionType,
                        );
                    }
                }
            }

            await selectmenu?.execute(interaction, client);
        } catch (error) {
            errorHandler(interaction, client, error as Error);
        }
    },
};
