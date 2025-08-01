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
    id: "vanity-update-author",

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
        const value3 = new TextInputBuilder()

        modal.setTitle("Vanity Update")
        modal.setCustomId(`vanity-update-author-modal:${data?.UUID}`)

        value.setCustomId("vanity-update-author-input")
            .setLabel("New Author Name")
            .setStyle(1)
            .setRequired(true)
            .setMaxLength(256)
            .setMinLength(1)
            .setPlaceholder("Enter the new author name for your vanity URL");
        value2.setCustomId("vanity-update-author-icon-input")
            .setLabel("New Author Icon")
            .setStyle(1)
            .setRequired(false)
            .setMaxLength(256)
            .setMinLength(1)
            .setPlaceholder("Enter the new author icon URL (optional)");
        value3.setCustomId("vanity-update-author-url-input")
            .setLabel("New Author URL")
            .setStyle(1)
            .setRequired(false)
            .setMaxLength(256)
            .setMinLength(1)
            .setPlaceholder("Enter the new author URL (optional)");


        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(value)
            , new ActionRowBuilder<TextInputBuilder>().addComponents(value2)
            , new ActionRowBuilder<TextInputBuilder>().addComponents(value3)
        );

        await interaction.showModal(modal);
    }
};
