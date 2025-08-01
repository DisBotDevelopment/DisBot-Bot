import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-change-slug",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("The client is not ready");
        const data = await database.vanitys.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });


        const modal = new ModalBuilder()
        const value = new TextInputBuilder()

        modal.setTitle("Vanity Update")
        modal.setCustomId(`vanity-change-slug-modal:${data?.UUID}`)

        value.setCustomId("vanity-change-slug-input")
            .setLabel("New Slug")
            .setStyle(1)
            .setRequired(true)
            .setMaxLength(256)
            .setMinLength(1)
            .setPlaceholder("Enter the new slug for your vanity URL (e.g., '/new-slug')");


        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(value)
        );

        await interaction.showModal(modal);
    }
};
