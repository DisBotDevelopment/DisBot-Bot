import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";

export default {
    id: "logging-add-note-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1]
        const message = interaction.fields.getTextInputValue("message")

        const data = await database.guildLogs.findFirst({
            where: {
                UUID: uuid,
            }
        })

        if (!data) return interaction.reply({
            content: `## ${await convertToEmojiToPng("error")} There is no such message. Please try again later.`,
            flags: MessageFlags.Ephemeral,
        })

        await database.guildLogs.update({
            where: {
                UUID: uuid
            },
            data: {
                Notes: {
                    push: message,
                }
            }
        })

        await interaction.reply({
            content: `## ${await convertToEmojiToPng("check")} Note added successfully.`,
            flags: MessageFlags.Ephemeral,
        })

    }
}