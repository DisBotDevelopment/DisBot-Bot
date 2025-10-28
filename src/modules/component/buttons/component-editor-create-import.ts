import {
    ActionRowBuilder, AttachmentBuilder,
    ButtonBuilder, ButtonInteraction,
    ButtonStyle,
    ComponentBuilder,
    ContainerBuilder, FileBuilder, FileUploadBuilder, LabelBuilder,
    MessageFlags, ModalBuilder,
    ModalSubmitInteraction, StringSelectMenuBuilder,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";

export default {
    id: "component-editor-create-import",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const messageId = interaction.customId.split(":")[1];

        const modal = new ModalBuilder()

        const file = new FileUploadBuilder()

        modal
            .setCustomId(`component-editor-create-import-modal:` + messageId)
            .setTitle("Import JSON File")

        file
            .setMaxValues(1)
            .setMinValues(1)
            .setCustomId("file")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Upload your JSON File")
                    .setDescription("Upload your JSON file from an Online Web editor or from DisBot.")
                    .setFileUploadComponent(file)
            )

        await interaction.showModal(modal);
    },
};
