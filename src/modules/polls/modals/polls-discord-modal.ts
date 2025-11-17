import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ComponentType,
    MessageActionRowComponent,
    MessageFlags,
    ModalSubmitInteraction, PollAnswerData,
    TextChannel
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import ms from "ms";

export default {
    id: "polls-discord-modal",

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {

            const title = interaction.fields.getTextInputValue("title");
            const answers = interaction.fields.getTextInputValue("answers").split("\n")
            const time = interaction.fields.getTextInputValue("time");
            const multi = interaction.fields.getTextInputValue("multi");

            if (multi !== 'Yes' && multi !== 'No') {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} Please use Yes or No in "Multi Answers"`
                });
            }

            const pollAnswers: PollAnswerData[] = []
            for (const answer of answers) {
                const emoji = answer.split(":")[0].trim().replace("-", "").replaceAll(" ", "")
                const text = answer.split(":")[1].trim()

                if (!emoji || !text) return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} You input was incorrect! Please try again.`
                })
                const option: PollAnswerData = {
                    text: text,
                    emoji: emoji,
                }
                pollAnswers.push(option)
            }

            await (interaction.channel as TextChannel).send({
                poll: {
                    duration: Number(time),
                    allowMultiselect: multi == "Yes",
                    answers: pollAnswers,
                    layoutType: 1,
                    question: {text: title}
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("check")} Poll created in your channel`
            })

        } catch (e) {
            console.log(e)
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("error")} You input was incorrect! Please try again.`
            })

        }
    }
};
