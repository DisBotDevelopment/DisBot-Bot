import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";

export default {
    id: "ticket-set-button-openmessage-button",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const message = await interaction.channel?.messages.fetch(
            interaction.message.id
        );

        const content = message?.content.split("-");
        if (!content) throw new Error("Invalid Content");
        const messageid = await interaction.channel?.messages.fetch(
            content[0] as string
        );

        if (!messageid) throw new Error("Invalid Message ID");

        const messages = await interaction.channel?.messages.fetch(messageid.id);

        const modal = new ModalBuilder();

        const openMessage = new TextInputBuilder();

        modal
            .setTitle("Set a Open Message")
            .setCustomId("ticketbutton-openmessage");

        openMessage
            .setLabel("Open Message")

            .setCustomId("message")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("A Cool Message")

            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(openMessage)
        );

        interaction.showModal(modal);
    }
};
