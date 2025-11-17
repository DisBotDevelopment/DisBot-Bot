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
    id: "ticket-add-component-use-button",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();

        const name = new TextInputBuilder();
        const emoji = new TextInputBuilder();
        const style = new TextInputBuilder();
        const messageUrl = new TextInputBuilder();

        modal
            .setTitle("Use Component with Button")
            .setCustomId(
                "ticket-add-component-use-button-modal:" + interaction.customId.split(":")[1]
            );

        messageUrl
            .setCustomId("messageurl")
            .setLabel("Sent a Message Url")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        name
            .setCustomId("name")
            .setLabel("Button Label")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        emoji
            .setCustomId("emoji")
            .setLabel("Button Emoji")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        style
            .setCustomId("style")
            .setLabel("Button Style")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(messageUrl),
            new ActionRowBuilder<TextInputBuilder>().addComponents(name),
            new ActionRowBuilder<TextInputBuilder>().addComponents(emoji),
            new ActionRowBuilder<TextInputBuilder>().addComponents(style)
        );

        await interaction.showModal(modal);
    },
};
