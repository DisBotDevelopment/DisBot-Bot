import {
    ActionRowBuilder,
    ButtonInteraction,
    ChannelType,
    MessageFlags, ModalBuilder,
    StringSelectMenuBuilder,
    TextDisplayBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";

export default {
    id: "permissions-manage-cooldown",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
        const cooldown = new TextInputBuilder()

        modal.setCustomId("permissions-manage-cooldown-modal:" + interaction.customId.split(":")[1]).setTitle("Set a Cooldown")

        cooldown
            .setCustomId("cooldown")
            .setLabel("Set a Cooldown")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Set a Number like 0-unlimited cooldown")

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(cooldown))

        await interaction.showModal(modal)
    }
};
