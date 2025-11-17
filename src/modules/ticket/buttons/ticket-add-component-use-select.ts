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
    id: "ticket-add-component-use-select",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();

        const name = new TextInputBuilder();
        const description = new TextInputBuilder();
        const emoji = new TextInputBuilder();
        const placeholder = new TextInputBuilder();
        const messageUrl = new TextInputBuilder();

        modal
            .setTitle("Use Component with Button")
            .setCustomId(
                "ticket-add-component-use-select-modal:" + interaction.customId.split(":")[1]
            );

        messageUrl
            .setCustomId("messageurl")
            .setLabel("Sent a Message Url")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        name
            .setCustomId("name")
            .setLabel("Selectmenu Label")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        description
            .setCustomId("description")
            .setLabel("Selectmenu Description")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        emoji
            .setCustomId("emoji")
            .setLabel("Selectmenu Emoji")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        placeholder
            .setCustomId("placeholder")
            .setLabel("Selectmenu Placeholder")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(messageUrl),
            new ActionRowBuilder<TextInputBuilder>().addComponents(name),
            new ActionRowBuilder<TextInputBuilder>().addComponents(description),
            new ActionRowBuilder<TextInputBuilder>().addComponents(emoji),
            new ActionRowBuilder<TextInputBuilder>().addComponents(placeholder)
        );

        await interaction.showModal(modal);
    },
};
