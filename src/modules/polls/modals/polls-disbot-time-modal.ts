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
import {convertToEmojiPng} from "../../../helper/emojis.js";
import ms from "ms";
import {NUM} from "undici/lib/llhttp/constants.js";

export default {
    id: "polls-disbot-time-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        const uuid = getInteractionData(interaction, 1)

        const data = await database.polls.findFirst({
            where: {
                UUID: uuid
            }
        })
        if (!data) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} No Poll Data found!`
            })
        }
        try {
            const timeInput = interaction.fields.getTextInputValue("time");
            const timeMs = ms(timeInput as ms.StringValue);

            if (!timeMs) {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiPng("error", client.user.id)} Please use the Time Format 1m, 10m, 20m, etc.`
                });
            }

            await database.polls.update({
                where: {UUID: uuid},
                data: {Time: timeMs}
            });

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} Updated your Time to ${timeInput}`
            });

        } catch (e) {
            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} Something went wrong.`
            });
        }
    }
};
