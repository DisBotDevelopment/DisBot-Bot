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
    id: "ticket-add-component-command-text",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const uuid = new TextInputBuilder();

        modal
            .setTitle("Ticket Chat Command")
            .setCustomId(
                "ticket-add-component-command-text-modal:" + interaction.customId.split(":")[1]
            );
        uuid
            .setCustomId("text")
            .setLabel("Text Command")
            .setPlaceholder("d!getsupport")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(uuid));

        await interaction.showModal(modal);
    },
};
