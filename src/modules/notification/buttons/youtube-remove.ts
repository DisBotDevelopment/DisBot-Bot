import {ButtonInteraction, ButtonStyle, MessageFlags, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "youtube-remove",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const youtubeData = await database.youtubeNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!client.user) throw new Error("Client User is not defined");

        if (!youtubeData)
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} There are no Youtube Channels added!`,
                flags: MessageFlags.Ephemeral
            });

        await database.youtubeNotifications.deleteMany({
            where: {
                GuildId: interaction.guild?.id,
                UUID: interaction.customId.split(":")[1]
            }
        });

        await interaction.update({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} The Channel ${youtubeData.YoutubeChannelId} has been Removed!`,
            components: [],
            embeds: []
        });
    }
};
