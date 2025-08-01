import "dotenv/config";
import {
    ActionRowBuilder,
    MessageFlags,
    ModalBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "autoreact-add",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {

        for (const value of interaction.values) {
            const modal = new ModalBuilder()
            const emoji = new TextInputBuilder()
            const channel = new TextInputBuilder()

            modal.setCustomId("autoreact-add-modal")
            modal.setTitle("Add Autoreact")

            emoji
                .setCustomId("emoji")
                .setLabel("Emoji")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Post the Emoji here to add to the Channel.")
                .setRequired(true)

            channel
                .setCustomId("channel")
                .setLabel("Channel")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Post the Channel ID here to add the Emoji to.")
                .setRequired(true)
                .setValue(value)

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(emoji),
                new ActionRowBuilder<TextInputBuilder>().addComponents(channel)
            )

            interaction.showModal(modal)


        }
    },
};
