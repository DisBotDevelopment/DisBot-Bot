import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, UserSelectMenuInteraction} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

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
            await database.guildYoutubeNotifications.updateMany(
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

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated the channel to <#${value}>`, interaction, true)
        }
    }
};
