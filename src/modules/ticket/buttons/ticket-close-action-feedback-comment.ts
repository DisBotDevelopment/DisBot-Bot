import {
    ActionRowBuilder,
    ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, ticketErrorMessage} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-close-action-feedback-comment",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
        const comment = new TextInputBuilder()

        modal.setTitle("Feedback Comment").setCustomId("ticket-close-action-feedback-comment-modal:" + interaction.customId.split(":")[1])

        comment
            .setCustomId("comment")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setLabel("Comment")

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(comment))

        await interaction.showModal(modal)
    },
};
