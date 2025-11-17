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
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {PaginationData} from "../../../types/Pagination.js";
import {database} from "../../../main/database.js";

export default {
    id: "polls-disbot-time",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        try {
            const modal = new ModalBuilder()
            const answersCount = new TextInputBuilder()

            modal
                .setCustomId("polls-disbot-time-modal:" + interaction.customId.split(":")[1])
                .setTitle("DisBot Poll")

            answersCount
                .setCustomId("time")
                .setLabel("Time")
                .setRequired(false)
                .setMinLength(1)
                .setMaxLength(3)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Time Format: 1m, 1d, 1h, 10h, etc.")

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(answersCount),)

            await interaction.showModal(modal)
        } catch (err) {
            console.error(err)
        }
    }
};
