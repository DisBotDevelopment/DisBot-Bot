import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    GuildChannel,
    MessageFlags,
    ModalSubmitInteraction,
    TextBasedChannel
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verification-reaction-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not defined.");

        const data = await database.verificationGates.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!data?.Action && !data?.ChannelId && !data?.MessageId && !data?.ActionType) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No security gate verification action found for this button.`, interaction, true, "reply")
        }

        const emojiInput = interaction.fields.getTextInputValue("security-gate-verification-emoji-input");

        try {
            const channel = (interaction.guild?.channels.cache.get(data?.ChannelId as string) as TextBasedChannel | GuildChannel);
            const message = channel.isTextBased() ? await channel.messages.fetch(data?.MessageId as string) : null;

            if (!message) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The message for the security gate verification button was not found.`, interaction, true, "reply")
            }

            await message?.react(emojiInput)

            return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Security gate verification reaction has been set successfully!`, interaction, true, "reply")
        } catch (error) {
            console.error("Error setting security gate verification button:", error);
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} An error occurred while setting the security gate verification reaction.`, interaction, true, "reply")
        }
    }
}
