import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, UserSelectMenuInteraction} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "youtube-add-channel",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {
            await database.youtubeNotifications.updateMany(
                {
                    where: {
                        UUID: interaction.customId.split(":")[1]
                    },
                    data: {
                        YoutubeChannelId: value
                    }
                }
            );


            if (!client.user) throw new Error("Client is not defined");

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        "youtube-add-message:" + interaction.customId.split(":")[1]
                    )
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("Message Template")
            );

            interaction.update({
                content: `## ${await convertToEmojiPng(
                    "text",
                    client.user.id
                )} Use a message template for the message that will be sent to the channel.`, components: [row]
            });
        }
    }
};
