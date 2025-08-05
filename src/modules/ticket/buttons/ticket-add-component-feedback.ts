import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ContainerBuilder,
    MessageFlags, ModalBuilder, RoleSelectMenuBuilder, SeparatorBuilder, SeparatorComponent, SeparatorSpacingSize,
    StringSelectMenuBuilder,
    TextDisplayBuilder, TextInputBuilder, TextInputStyle,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-feedback",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]


        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: uuid
            }
        })
        if (data.WithTicketFeedback) {


            await database.ticketSetups.update({
                where: {
                    CustomId: uuid
                },
                data: {
                    WithTicketFeedback: false
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} Disabled User Feedback after Close`
            })

        } else {

            await database.ticketSetups.update({
                where: {
                    CustomId: uuid
                },
                data: {
                    WithTicketFeedback: true
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} Enabled User Feedback after Close`
            })
        }
    }


}
;
 