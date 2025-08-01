import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";

export default {
    id: "ticket-set-button-messages",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const message = await interaction.channel?.messages.fetch(
            interaction.message.id
        );

        const modal = new ModalBuilder();
        const uuid = new TextInputBuilder();

        modal
            .setTitle("Ticket Menu Messages")
            .setCustomId(
                "ticket-set-button-messages-modal:" + interaction.customId.split(":")[1]
            );
        uuid
            .setPlaceholder("Set here your UUID from the message templates")
            .setCustomId("ticket-set-button-messages-uuid")
            .setLabel("UUID")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(uuid));

        interaction.showModal(modal);
    },
};
