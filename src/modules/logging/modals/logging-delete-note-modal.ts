import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "logging-delete-note-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1]
        const message = interaction.fields.getTextInputValue("message")
        const number = Number(message)

        const data = await database.guildLoggers.findFirst({
            where: {
                UUID: uuid,
            }
        })


        if (!data) return interaction.reply({
            content: `## ${await convertToEmojiPng("error", client.user.id)} There is no such message. Please try again later.`,
            flags: MessageFlags.Ephemeral,
        })

        const newNotes = [...data.Notes]
        newNotes.splice(number - 1, 1)

        await database.guildLoggers.update({
            where: {
                UUID: uuid
            },
            data: {
                Notes: {
                    set: newNotes
                }
            }
        })

        await database.guildLoggers.update({
            where: {
                UUID: uuid
            },
            data: {
                Notes: {
                    set: newNotes
                }
            }
        })

        interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Deleted your note with the Id ${number}`,
            flags: MessageFlags.Ephemeral,
        })


    }
}