import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Client,
    MessageFlags,
    UserSelectMenuInteraction
} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "twitch-add-channel",

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
            await database.twitchNotifications.updateMany(
                {
                    where: {
                        UUID: interaction.customId.split(":")[1]
                    }
                    ,
                    data: {
                        ChannelId: value
                    }
                }
            );

            if (!client.user) throw new Error("Client is not defined");


            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        "twitch-add-message:" + interaction.customId.split(":")[1]
                    )
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("Message Template")
                    .setEmoji("<:addchannel:1324458759589728387>")
            );

            interaction.update({
                content: `## ${await convertToEmojiPng(
                    "text",
                    client.user.id
                )} Use a message template for the message that will be sent to the channel.`, components: [row]
            });
        });
    }
};
