import {
    ActionRowBuilder,
    ButtonStyle,
    Client,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "spotify-add-channel",

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
                    where: {
                        UUID: uuid
                    }
                    ,
                    data: {
                        ChannelId: role,
                    }
                }
            );

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated the channel to <#${role}>`, interaction, true)

        }
    }
};
