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
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-modal-reset",

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

        if (!data) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("check")} There is no Modal Data!`
            })
        }

        await database.ticketSetups.update({
            include: {
                ModalOptions: true
            },
            where: {
                CustomId: uuid
            },
            data: {
                ModalTitle: null,
                HasModal: false,
                ModalOptions: {
                    set: []
                }
            }
        })


        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiToPng("check")} Reset the Modal Options and Title`
        })
    }
};
 