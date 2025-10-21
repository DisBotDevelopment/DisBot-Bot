import {ButtonInteraction, ButtonStyle, MessageFlags, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "twitch-remove",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const data = await database.guildTwitchNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                UUID: interaction.customId.split(":")[1]
            }
        });
        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "error"
                )} The Channel has already been removed!`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.guildTwitchNotifications.deleteMany({
            where: {
                GuildId: interaction.guild?.id,
                UUID: interaction.customId.split(":")[1]
            }
        });
        await interaction.update({
            content: `## ${await convertToEmojiToPng(
                "check"
            )} The Channels ${data.TwitchChannelName} has been Removed!`,
            components: [],
            embeds: []
        });
    }
};
