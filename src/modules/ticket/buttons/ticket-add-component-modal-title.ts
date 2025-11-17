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
    id: "ticket-add-component-modal-title",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]

        const modal = new ModalBuilder()
        const title = new TextInputBuilder()

        modal
            .setCustomId("ticket-add-component-modal-title-modal:" + uuid)
            .setTitle("Add Modal Option")

        title
            .setStyle(TextInputStyle.Short)
            .setCustomId("title")
            .setRequired(true)
            .setPlaceholder("My Cool Ticket Modal Title")
            .setLabel("Title")


        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(title),
        )

        await interaction.showModal(modal)

    }
};
 