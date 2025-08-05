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
    id: "ticket-add-component-ticket-creation-cooldown",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const uuid = new TextInputBuilder();

        modal
            .setTitle("Ticket User Cooldown")
            .setCustomId(
                "ticket-add-component-ticket-creation-cooldown-modal:" + interaction.customId.split(":")[1]
            );
        uuid
            .setCustomId("time")
            .setLabel("Cooldown")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(uuid));

        await interaction.showModal(modal);
    },
};
