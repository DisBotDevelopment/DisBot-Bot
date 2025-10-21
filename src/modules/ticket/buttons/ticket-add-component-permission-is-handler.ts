import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ContainerBuilder,
    MessageFlags, RoleSelectMenuBuilder, SeparatorBuilder, SeparatorComponent, SeparatorSpacingSize,
    StringSelectMenuBuilder,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-add-component-permission-is-handler",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]

        const data = await database.ticketPermissions.findFirst({
            where: {
                UUID: uuid
            }
        })

        if (data.IsHandler) {
            await database.ticketPermissions.update({
                where: {
                    UUID: uuid
                },
                data: {
                    IsHandler: false
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("check")} Reset Mod-Status for <@&${data.DiscordRoleId}> successfully.`
            })

        } else {
            await database.ticketPermissions.update({
                where: {
                    UUID: uuid
                },
                data: {
                    IsHandler: true
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("check")} Set Mod-Status for <@&${data.DiscordRoleId}> successfully.`
            })

        }


    }
};
