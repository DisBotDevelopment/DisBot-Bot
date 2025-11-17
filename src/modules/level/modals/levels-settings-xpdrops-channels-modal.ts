import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, ModalSubmitInteraction,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-xpdrops-channels-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {

            const input = interaction.fields.getSelectedChannels("input", true, [ChannelType.GuildText])
            const uuid = interaction.customId.split(":")[1]

            const channels = []
            for (const channel of input.values()) {
                channels.push(channel.id)
            }

            await database.xPDrops.update({
                where: {
                    UUID: uuid
                },
                data: {
                    ChannelIds: {
                        set: channels
                    }
                }
            })

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Set Channels to [${channels.map((c) => `<#${c}>`)}]`, interaction, true, "reply")

        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }
    }
};
