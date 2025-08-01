import {ChannelType, Client, UserSelectMenuInteraction} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    id: "youtube-edit-channel",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuids = uuid();
        for (const value of interaction.values) {
            const channel = interaction.guild?.channels.cache.get(value);

            await database.youtubeNotifications.updateMany(
                {
                    where: {
                        UUID: interaction.customId.split(":")[1]
                    }
                    ,
                    data: {
                        ChannelId: channel?.id
                    }
                }
            );
            if (!client.user) throw new Error("Client not found");

            await interaction.update({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} The Channel has been Updated!`,
                components: [],
                embeds: []
            });
        }
    }
};
