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
    id: "levels-settings-xpdrops-respawn-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {

            const input = interaction.fields.getTextInputValue("input")
            const uuid = interaction.customId.split(":")[1]
            await database.xPDrops.update({
                where: {
                    UUID: uuid
                },
                data: {
                    TimeToRespawn: input
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Changed Drop Respawn Time to ${input}`, interaction, true, "reply")

        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }
    }
};
