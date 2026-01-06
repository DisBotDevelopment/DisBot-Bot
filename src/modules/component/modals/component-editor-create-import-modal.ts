import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder, LabelBuilder,
    MessageFlags, ModalBuilder,
    ModalSubmitInteraction, StringSelectMenuBuilder, TextChannel, TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {showComponentFollowModal, updateComponentsWithPositions} from "../../../helper/messageHelper.js";
import {Channel} from "diagnostics_channel";

export default {
    id: "component-editor-create-import-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const messageId = interaction.customId.split(":")[1]

        const message = await (interaction.channel as TextChannel).messages.fetch(messageId)


        const data = interaction.fields.getUploadedFiles("file")
        const url = data.first().url
        const blob = await fetch(url)
        const json = await blob.blob()
        const buffer = Buffer.from(await json.arrayBuffer())
        console.log(buffer.toString("utf-8"))

        await updateComponentsWithPositions(
            message,
            JSON.parse(buffer.toString("utf-8")),
            null,
        )
        
        await interaction.deferUpdate()
    }
}