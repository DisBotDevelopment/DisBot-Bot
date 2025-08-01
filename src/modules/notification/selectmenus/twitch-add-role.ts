import {ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, Client, UserSelectMenuInteraction} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "twitch-add-role",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: Client) {

        const uuids = uuid();

        interaction.values.forEach(async (value) => {
            const role = interaction.guild?.roles.cache.get(value);

            await database.twitchNotifications.updateMany(
                {
                    where: {UUID: interaction.customId.split(":")[1]},
                    data: {
                        PingRoles: {
                            set: [role?.id]
                        }
                    }
                }
            );
            if (!client.user) throw new Error("Client User is not defined");
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
                            "twitch-add-channel:" + interaction.customId.split(":")[1]
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
        });
    }
};
