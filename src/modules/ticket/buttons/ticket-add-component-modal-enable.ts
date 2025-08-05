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
    id: "ticket-add-component-modal-enable",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]


        const data = await database.ticketSetups.findFirst({
            include: {
                ModalOptions: true
            },
            where: {
                CustomId: uuid
            }
        })

        if (data.ModalOptions.length < 1) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} You need one or more Modal Options to enable Modals.`
            })
        }
        if (!data.ModalTitle) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} You need a Title to enable Modals.`
            })
        }

        if (data.HasModal) {

            await database.ticketSetups.update({
                where: {
                    CustomId: uuid
                },
                data: {
                    HasModal: false
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} You modal has been disabled!`
            })

        } else {
            await database.ticketSetups.update({
                where: {
                    CustomId: uuid
                },
                data: {
                    HasModal: true
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} You modal has been enabled!`
            })
        }

    }
};
 