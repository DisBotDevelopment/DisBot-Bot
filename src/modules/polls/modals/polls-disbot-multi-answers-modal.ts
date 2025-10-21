import {
    MessageFlags, ModalSubmitInteraction,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {getInteractionData} from "../../../helper/utilityHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {NUM} from "undici/lib/llhttp/constants.js";

export default {
    id: "polls-disbot-multi-answers-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

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

        if (data.PollOptions.length <= 1) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("error")} You need to create 2 Options!`
            })
        }

        if ((interaction.fields.getTextInputValue("answerscount") as unknown as number) > 25 ||
            (interaction.fields.getTextInputValue("answerscount") as unknown as number) < 0 ||
            (interaction.fields.getTextInputValue("answerscount") as unknown as number) > data.PollOptions.length + 1
        ) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("error")} The Count must be under 25 and 1 or above`
            })
        }


        await database.polls.update({
            where: {
                UUID: uuid
            },
            data: {
                MultiAnswers: Number(interaction.fields.getTextInputValue("answerscount")) ?? null
            }
        })

        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiToPng("check")} Updated your Multi Answers to ${(interaction.fields.getTextInputValue("answerscount") as unknown as number) ?? "Default"}`
        })


    }
};
