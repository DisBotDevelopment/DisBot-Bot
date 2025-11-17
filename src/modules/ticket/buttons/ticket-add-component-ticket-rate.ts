import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    id: "ticket-add-component-ticket-rate",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const uuid = new TextInputBuilder();
        const messageUrl = new TextInputBuilder()
        const messageTId = new TextInputBuilder()

        modal
            .setTitle("Ticket Rate Limit")
            .setCustomId(
                "ticket-add-component-ticket-rate-modal:" + interaction.customId.split(":")[1]
            );
        uuid
            .setPlaceholder(`Green, Orange, Red\nExample:\n- 0,5,10`,)
            .setCustomId("limit")
            .setLabel("Rate Limit")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        messageTId
            .setPlaceholder("")
            .setCustomId("message")
            .setLabel("Message Template")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        messageUrl
            .setPlaceholder(`Message URL (Placeholder in message {ticket.status.current} {ticket.status.<green,yellow,red})`)
            .setCustomId("messageUrl")
            .setLabel("Message Url")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(uuid), new ActionRowBuilder<TextInputBuilder>().addComponents(messageTId), new ActionRowBuilder<TextInputBuilder>().addComponents(messageUrl));

        await interaction.showModal(modal);
    },
};
