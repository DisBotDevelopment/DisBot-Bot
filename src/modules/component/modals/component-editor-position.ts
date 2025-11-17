import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder, LabelBuilder,
    MessageFlags, ModalBuilder,
    ModalSubmitInteraction, StringSelectMenuBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {showComponentFollowModal, updateComponentsWithPositions} from "../../../helper/messageHelper.js";
import {Channel} from "diagnostics_channel";

export default {
    id: "component-editor-position",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const messageId = interaction.customId.split(":")[1]
        const type = interaction.customId.split(":")[2]
        const position = interaction.fields.getTextInputValue("position")
        const id = interaction.fields.getTextInputValue("id")

        await showComponentFollowModal(
            interaction,
            id,
            messageId,
            position,
            type,
            client,
        )
    }
}