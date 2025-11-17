import {
    ActionRowBuilder, BaseChannel, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder, GuildChannel, LabelBuilder,
    MessageFlags,
    ModalBuilder, ModalSubmitInteraction,
    TextInputBuilder, TextInputStyle, VoiceChannel
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {NUM} from "undici/lib/llhttp/constants.js";
import ms, {StringValue} from "ms";

export default {
    id: "levels-settings-messages-type-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const input = interaction.fields.getSelectedChannels("channel", true, [ChannelType.GuildText])
            for (const channel of input.values()) {

                console.log(channel.id)

                await database.levelSettings.update({
                    where: {
                        GuildId: interaction.guild.id
                    },
                    data: {
                        LevelUpChannelId: channel.id
                    }
                })

                await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Set new Level Up Channel`, interaction, true, "reply")
            }
        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }
    }
};
