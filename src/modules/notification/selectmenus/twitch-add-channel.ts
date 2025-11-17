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
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

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
        for (const value of interaction.values) {
            await database.guildTwitchNotifications.updateMany(
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


            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated the channel to <#${value}>`, interaction, true)
        }
    }
};
