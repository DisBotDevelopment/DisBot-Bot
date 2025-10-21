import {
    ActionRowBuilder,
    ButtonInteraction, ButtonStyle,
    ChannelType,
    MessageFlags,
    ModalBuilder, ModalSubmitInteraction,
    StringSelectMenuBuilder,
    TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";
import {getInteractionData} from "../../../helper/utilityHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import ms from "ms";
import {randomUUID} from "crypto";

export default {
    id: "polls-disbot-options-add-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        const label = interaction.fields.getTextInputValue("label")
        const description = interaction.fields.getTextInputValue("description")
        const emoji = interaction.fields.getTextInputValue("emoji")
        const uuid = getInteractionData(interaction, 1)

        const data = await database.polls.findFirst({
            include: {
                PollOptions: true
            },
            where: {
                UUID: uuid
            }
        })
        if (!data) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("error")} No Poll Data found!`
            })
        }

        if (data.PollOptions.length >= 25) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("error")} You only can have 25 Options!`
            })
        }

        await database.pollOptions.create({
            data: {
                UUID: randomUUID(),
                Emoji: emoji ?? null,
                Label: label,
                Description: description,
                UserIds: [],
                Polls: {
                    connect: {
                        UUID: uuid,
                    }
                }
            }
        })

        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiToPng("check")} Added Poll Option to ${uuid}`
        })
    }
};
