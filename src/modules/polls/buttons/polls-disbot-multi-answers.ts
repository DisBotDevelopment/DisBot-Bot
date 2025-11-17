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
    id: "polls-disbot-multi-answers",

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
                .setCustomId("polls-disbot-multi-answers-modal:" + interaction.customId.split(":")[1])
                .setTitle("DisBot Poll")

            answersCount
                .setCustomId("answerscount")
                .setLabel("Count")
                .setRequired(false)
                .setMinLength(1)
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("2-25 – Set to 0 to allow both voting and unvoting, or 1 to allow only voting.")

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(answersCount),)

            await interaction.showModal(modal)
        } catch (err) {
            console.error(err)
        }
    }
};
