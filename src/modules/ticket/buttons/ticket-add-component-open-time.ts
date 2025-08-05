import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "ticket-add-component-open-time",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const uuid = new TextInputBuilder();

        modal
            .setTitle("Ticket Open Time")
            .setCustomId(
                "ticket-add-component-open-time-modal:" + interaction.customId.split(":")[1]
            );
        uuid
            .setCustomId("time")
            .setLabel("Set a Opening Time (Like from 12:00,13:00)")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(uuid));

        await interaction.showModal(modal);
    },
};
