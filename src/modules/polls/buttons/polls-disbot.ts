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
    id: "polls-disbot",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {


        const modal = new ModalBuilder()
        const messageTemplate = new TextInputBuilder()
        const type = new TextInputBuilder()
        const requirements = new TextInputBuilder()


        modal
            .setCustomId("polls-disbot-modal")
            .setTitle("Create a Poll")

        messageTemplate
            .setCustomId("message-template")
            .setRequired(true)
            .setLabel("Message Template")
            .setStyle(TextInputStyle.Short)

        type
            .setCustomId("type")
            .setRequired(true)
            .setLabel("Poll Type")
            .setPlaceholder("Button or Selectmenu")
            .setStyle(TextInputStyle.Short)

        requirements
            .setCustomId("requirements")
            .setRequired(false)
            .setLabel("Role Name")
            .setPlaceholder("One Role Name from your Discord")
            .setStyle(TextInputStyle.Short)

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(messageTemplate),
            new ActionRowBuilder<TextInputBuilder>().addComponents(type),
            new ActionRowBuilder<TextInputBuilder>().addComponents(requirements),
        )

        await interaction.showModal(modal)
    }
};
