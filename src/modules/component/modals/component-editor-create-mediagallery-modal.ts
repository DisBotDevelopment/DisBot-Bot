import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder, LabelBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder,
    MessageFlags, ModalBuilder,
    ModalSubmitInteraction,
    SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, TextInputBuilder, TextInputStyle,
    ThumbnailBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {
    updateComponentsWithPositions
} from "../../../helper/messageHelper.js";
import {IMAGE_PLACEHOLDER} from "../../../main/placeholder.js";

export default {
    id: "component-editor-create-mediagallery-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const messageId = interaction.customId.split(":")[1]
        const message = await interaction.channel.messages.fetch(messageId)
        const positions = interaction.customId.split(":")[2].split(",")
        const id = interaction.customId.split(":")[3]
        const data = interaction.fields.getTextInputValue("data").split("|")

        const items: MediaGalleryItemBuilder[] = []
        for (const d of data) {

            let imageUrl = d.split(";")[0] ?? d;
            for (const [key, value] of Object.entries(IMAGE_PLACEHOLDER)) {
                if (imageUrl.includes(key)) {
                    imageUrl = imageUrl.replace(key, value);
                }
            }

            items.push(
                new MediaGalleryItemBuilder()
                    .setURL(imageUrl)
                    .setDescription(d.split(";")[1] ?? " ")
                    .setSpoiler(d.split(";")[2] == "true")
            )
        }


        const media = new MediaGalleryBuilder()
            .setId(Number(id))
            .addItems(
                items
            )

        await updateComponentsWithPositions(
            message,
            media.toJSON(),
            positions,
        )

        await interaction.deferUpdate()
    }
}