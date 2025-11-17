import {
    ActionRowBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    Client,
    MessageFlags,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "spotify-add-role",

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
                        PingRoles: {
                            set: [role]
                        },
                    }
                }
            );

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated the ping role to <@&${role}>`, interaction, true)
        }
    }
};
