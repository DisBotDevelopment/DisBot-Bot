import {ButtonStyle, Client, MessageFlags, TextInputStyle, UserSelectMenuInteraction} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "spotify-manage-channelname-channel",

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


            await database.guildSpotifyNotifications.update(
                {
                    where: {UUID: uuid},
                    data: {
                        ChannelId: role,
                    }
                }
            );
            if (!client.user) throw new Error("Client user not found");
            await interaction.deferUpdate()
        }
    }
};
