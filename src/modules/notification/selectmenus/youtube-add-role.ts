import {ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, Client, UserSelectMenuInteraction} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    id: "youtube-add-role",

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
            const role = interaction.guild?.roles.cache.get(value);

            await database.youtubeNotifications.updateMany(
                {
                    where: {
                        UUID: interaction.customId.split(":")[1]
                    }
                    ,
                    data:
                        {
                            PingRoles: {
                                set: [role.id]
                            }
                        }
                })
            if (!client.user) throw new Error("Client is not defined");

            const row =
                new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                    new ChannelSelectMenuBuilder()
                        .addChannelTypes(
                            ChannelType.GuildText,
                            ChannelType.PublicThread,
                            ChannelType.PrivateThread,
                            ChannelType.GuildAnnouncement
                        )
                        .setCustomId(
                            "youtube-add-channel:" + interaction.customId.split(":")[1]
                        )
                        .setMaxValues(1)
                        .setMinValues(1)
                        .setPlaceholder("Select your Channel/Thread")
                );

            interaction.update({
                content: `## ${await convertToEmojiPng(
                    "text",
                    client.user.id
                )} Please select a Channel/Thread to send the message.`, components: [row]
            });
        }
    }
}
;
