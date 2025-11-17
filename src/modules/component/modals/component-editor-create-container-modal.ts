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

export default {
    id: "component-editor-create-container-modal",

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
        const color = interaction.fields.getTextInputValue("color");
        const spoiler = interaction.fields.getStringSelectValues("spoiler")[0]

        const container = new ContainerBuilder()
            .setId(Number(id))
            .setSpoiler(spoiler == "true")
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("Need for this Container. Override it if you want.")
            )

        if (color.split(",")[2] != undefined) container.setAccentColor([Number(color.split(",")[0]), Number(color.split(",")[1]), Number(color.split(",")[2])])

        await updateComponentsWithPositions(
            message,
            container.toJSON(),
            positions,
        )

        await interaction.deferUpdate()
    }
}