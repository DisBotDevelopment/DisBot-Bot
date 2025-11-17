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
    id: "ticket-add-component-command-slash",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();
        const uuid = new TextInputBuilder();
        const description = new TextInputBuilder();

        modal
            .setTitle("Ticket Slash Command")
            .setCustomId(
                "ticket-add-component-command-slash-modal:" + interaction.customId.split(":")[1]
            );
        uuid
            .setCustomId("text")
            .setLabel("Command Name")
            .setPlaceholder("getsupport (Will be used as /getsupport)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        description
            .setCustomId("description")
            .setLabel("Command Description")
            .setPlaceholder("My Command Support Command")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(uuid), new ActionRowBuilder<TextInputBuilder>().addComponents(description));

        await interaction.showModal(modal);
    },
};
