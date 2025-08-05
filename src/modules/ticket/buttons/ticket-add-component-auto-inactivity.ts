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
    id: "ticket-add-component-auto-inactivity",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const uuid = new TextInputBuilder();

        modal
            .setTitle("Ticket Auto Close after inactivity")
            .setCustomId(
                "ticket-add-component-auto-inactivity-modal:" + interaction.customId.split(":")[1]
            );
        uuid
            .setCustomId("time")
            .setLabel("Time (1s, 1m, 1h, 1d)")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(uuid));

        await interaction.showModal(modal);
    },
};
