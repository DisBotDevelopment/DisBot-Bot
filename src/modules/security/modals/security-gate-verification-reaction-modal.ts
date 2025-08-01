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
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

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
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No security gate verification action found for this button.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const emojiInput = interaction.fields.getTextInputValue("security-gate-verification-emoji-input");

        try {
            const channel = (interaction.guild?.channels.cache.get(data?.ChannelId as string) as TextBasedChannel | GuildChannel);
            const message = channel.isTextBased() ? await channel.messages.fetch(data?.MessageId as string) : null;

            if (!message) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} The message for the security gate verification button was not found.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            await message?.react(emojiInput)

            await interaction.reply({
                content: `## ${await convertToEmojiPng("check", client.user?.id)} Security gate verification reaction has been set successfully!`,
                flags: MessageFlags.Ephemeral
            });

        } catch (error) {
            console.error("Error setting security gate verification button:", error);
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} An error occurred while setting the security gate verification reaction.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
