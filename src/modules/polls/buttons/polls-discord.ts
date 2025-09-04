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
    id: "polls-discord",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        try {
            const modal = new ModalBuilder()
            const title = new TextInputBuilder()
            const answers = new TextInputBuilder()
            const time = new TextInputBuilder()
            const multiAnswers = new TextInputBuilder()

            modal
                .setCustomId("polls-discord-modal")
                .setTitle("Discord Poll")

            title
                .setCustomId("title")
                .setLabel("Title")
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(300)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Question...")

            answers
                .setCustomId("answers")
                .setRequired(true)
                .setLabel("Answers")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("- emoji:description max.55")

            time
                .setCustomId("time")
                .setRequired(true)
                .setLabel("Time")
                .setMinLength(1)
                .setMaxLength(3)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Input your time in hours.")

            multiAnswers
                .setCustomId("multi")
                .setRequired(true)
                .setLabel("Multi Answers")
                .setStyle(TextInputStyle.Short)
                .setMinLength(2)
                .setMaxLength(3)
                .setPlaceholder("Yes or No")


            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(title),
                new ActionRowBuilder<TextInputBuilder>().addComponents(answers),
                new ActionRowBuilder<TextInputBuilder>().addComponents(time),
                new ActionRowBuilder<TextInputBuilder>().addComponents(multiAnswers),
            )

            await interaction.showModal(modal)
        } catch (err) {
            console.error(err)
        }
    }
};
