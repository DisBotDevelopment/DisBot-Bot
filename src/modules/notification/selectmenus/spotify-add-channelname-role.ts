import {
    ActionRowBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    Client,
    MessageFlags,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "spotify-add-channelname-role",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];
        for (const role of interaction.values) {


            const data = await database.guildSpotifyNotifications.findFirst({
                where: {
                    UUID: uuid
                }
            });

            await database.guildSpotifyNotifications.update(
                {
                    where: {UUID: uuid},
                    data: {
                        PingRoles: {
                            set: [role]
                        },
                    }
                }
            );

            if (!client.user) throw new Error("Client user not found");
            interaction.update({
                content: `## ${await convertToEmojiToPng("info")} Add a Channel to the Notification System`,
                components: [
                    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId("spotify-add-channelname-channel:" + data?.UUID)
                            .setPlaceholder("Select a Channel")
                    )
                ],
            })

        }
    }
};
