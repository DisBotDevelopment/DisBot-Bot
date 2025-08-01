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
    id: "vanity-update-image",

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
        const value2 = new TextInputBuilder()

        modal.setTitle("Vanity Update")
        modal.setCustomId(`vanity-update-image-modal:${data?.UUID}`)

        value.setCustomId("vanity-update-image-thumbnail-input")
            .setLabel("New Thumbnail")
            .setStyle(1)
            .setRequired(true)
            .setMaxLength(256)
            .setMinLength(1)
            .setPlaceholder("Enter the new image URL");

        value2.setCustomId("vanity-update-image-image-input")
            .setLabel("New Image")
            .setStyle(1)
            .setRequired(true)
            .setMaxLength(256)
            .setMinLength(1)
            .setPlaceholder("Enter the new thumbnail URL");


        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(value)
            , new ActionRowBuilder<TextInputBuilder>().addComponents(value2)
        );

        await interaction.showModal(modal);
    }
};
