import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder, LabelBuilder,
    MessageFlags, ModalBuilder,
    ModalSubmitInteraction, TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {showComponentFollowModal, updateComponentsWithPositions} from "../../../helper/messageHelper.js";

export default {
    id: "component-editor-create-textdisplay-modal",

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

        const textDisplayJSON = new TextDisplayBuilder().setContent(content).setId(Number(id));

        await updateComponentsWithPositions(
            message,
            textDisplayJSON.toJSON(),
            positions,
        )

        await interaction.deferUpdate()
    }
}