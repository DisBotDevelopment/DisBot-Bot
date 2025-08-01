import {ButtonInteraction, ButtonStyle, MessageFlags, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "twitch-remove",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const data = await database.twitchNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                UUID: interaction.customId.split(":")[1]
            }
        });
        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} The Channel has already been removed!`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.twitchNotifications.deleteMany({
            where: {
                GuildId: interaction.guild?.id,
                UUID: interaction.customId.split(":")[1]
            }
        });
        await interaction.update({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} The Channels ${data.TwitchChannelName} has been Removed!`,
            components: [],
            embeds: []
        });
    }
};
