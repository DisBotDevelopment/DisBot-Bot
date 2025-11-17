import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder, LabelBuilder,
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
import {IMAGE_PLACEHOLDER, URL_PLACEHOLDER} from "../../../main/placeholder.js";

export default {
    id: "component-editor-create-section-modal",

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
        const content = interaction.fields.getTextInputValue("content");
        const thumbnail = interaction.fields.getTextInputValue("thumbnail");
        const label = interaction.fields.getTextInputValue("label");
        const emoji = interaction.fields.getTextInputValue("emoji");
        const style = Number(interaction.fields.getStringSelectValues("style")[0])

        const section = new SectionBuilder()
            .setId(Number(id))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(content)
            )

        if (thumbnail && !style) {

            let imageUrl = thumbnail;
            for (const [key, value] of Object.entries(IMAGE_PLACEHOLDER)) {
                if (imageUrl.includes(key)) {
                    imageUrl = imageUrl.replace(key, value);
                }
            }

            section.setThumbnailAccessory(
                new ThumbnailBuilder()
                    .setURL(imageUrl)
                    .setDescription(label ?? " ")
                    .setSpoiler(Boolean(emoji) ?? false)
            )
        }
        if (style) {
            const button = new ButtonBuilder()
            button.setStyle(style)
            if (label) button.setLabel(label)
            if (emoji) button.setEmoji(emoji)
            if (style == ButtonStyle.Link) {

                let url = thumbnail;
                for (const [key, value] of Object.entries(URL_PLACEHOLDER)) {
                    if (url.includes(key)) {
                        url = url.replace(key, value);
                    }
                }

                button.setURL(url)
            } else button.setCustomId(thumbnail)
            section.setButtonAccessory(button)
        }

        await updateComponentsWithPositions(
            message,
            section.toJSON(),
            positions,
        )

        await interaction.deferUpdate()
    }
}