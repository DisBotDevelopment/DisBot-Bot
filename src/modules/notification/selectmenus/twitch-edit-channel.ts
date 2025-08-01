import {ChannelType, Client, UserSelectMenuInteraction} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    id: "twitch-edit-channel",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuids = uuid();
        interaction.values.forEach(async (value) => {
            const channel = interaction.guild?.channels.cache.get(value);

            await database.twitchNotifications.updateMany(
                {
                    where: {UUID: interaction.customId.split(":")[1]},
                    data: {
                        ChannelId: channel?.id
                    }
                }
            );
            if (!client.user) throw new Error("Client User is not defined");

            interaction.update({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} The Channel has been Updated!`,
                components: [],
                embeds: []
            });
        });
    }
};
