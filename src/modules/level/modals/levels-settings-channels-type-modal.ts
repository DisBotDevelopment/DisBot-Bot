import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, ModalSubmitInteraction,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {NUM} from "undici/lib/llhttp/constants.js";
import ms, {StringValue} from "ms";

export default {
    id: "levels-settings-channels-type-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const input = interaction.fields.getStringSelectValues("input").map((i) => i)

            if (input.includes("message") && input.includes("cooldown")) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Only cooldown or message selection allowed.`, interaction, true, "reply")
            }

            await database.levelSettings.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    MessageXPType: {
                        set: input
                    }
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated Message XP Type to [${input}]`, interaction, true, "reply")


        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }

    }
};
