import {
    ActionRowBuilder,
    ButtonInteraction, ButtonStyle,
    ChannelType,
    MessageFlags,
    ModalBuilder,
    StringSelectMenuBuilder,
    TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";

export default {
    id: "polls-disbot-options-add",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        try {
            const modal = new ModalBuilder()
            const label = new TextInputBuilder()
            const description = new TextInputBuilder()
            const emoji = new TextInputBuilder()

            modal
                .setCustomId("polls-disbot-options-add-modal:" + interaction.customId.split(":")[1])
                .setTitle("DisBot Poll")

            label
                .setCustomId("label")
                .setLabel("Label")
                .setRequired(true)
                .setMaxLength(34)
                .setMinLength(1)
                .setStyle(TextInputStyle.Short)

            description
                .setCustomId("description")
                .setLabel("Description")
                .setRequired(true)
                .setMaxLength(50)
                .setMinLength(1)
                .setStyle(TextInputStyle.Short)

            emoji
                .setCustomId("emoji")
                .setLabel("Emoji")
                .setRequired(false)
                .setMinLength(1)
                .setStyle(TextInputStyle.Short)

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(label),
                new ActionRowBuilder<TextInputBuilder>().addComponents(description),
                new ActionRowBuilder<TextInputBuilder>().addComponents(emoji),
            )

            await interaction.showModal(modal)
        } catch (err) {
            console.error(err)
        }
    }
};
