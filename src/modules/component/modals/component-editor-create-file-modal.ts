import {
    ActionRowBuilder, AttachmentBuilder,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder, FileBuilder, LabelBuilder,
    MessageFlags, ModalBuilder,
    ModalSubmitInteraction, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {updateComponentsWithPositions} from "../../../helper/messageHelper.js";

export default {
    id: "component-editor-create-file-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const messageId = interaction.customId.split(":")[1]
            const message = await interaction.channel.messages.fetch(messageId)
            const positions = interaction.customId.split(":")[2].split(",")
            const id = interaction.customId.split(":")[3]
            const name = interaction.fields.getTextInputValue("name");
            const url = interaction.fields.getTextInputValue("url");
            const spoiler = interaction.fields.getStringSelectValues("spoiler")[0];

            const file = new FileBuilder()
                .setId(Number(id))
                .setURL(`attachment://${name}`)
                .setSpoiler(spoiler == "true")

            const req = await fetch(url)
            const arrayBuffer = await req.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            await message.edit({
                files: [
                    new AttachmentBuilder(buffer).setName(`${name}`),
                ]
            })
            await updateComponentsWithPositions(
                message,
                file.toJSON(),
                positions,
            )

            await interaction.deferUpdate()
        } catch (e) {
            console.log(e)
        }
    }
}