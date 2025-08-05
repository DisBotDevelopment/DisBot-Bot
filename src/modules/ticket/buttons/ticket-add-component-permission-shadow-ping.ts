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
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-add-component-permission-shadow-ping",

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

        if (data.HasShadowPing) {
            await database.ticketPermissions.update({
                where: {
                    UUID: uuid
                },
                data: {
                    HasShadowPing: false
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} Disabled shadow-ping for <@&${data.DiscordRoleId}> successfully.`
            })

        } else {
            await database.ticketPermissions.update({
                where: {
                    UUID: uuid
                },
                data: {
                    HasShadowPing: true
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} Enabled shadow-ping for <@&${data.DiscordRoleId}> successfully.`
            })

        }


    }
};
