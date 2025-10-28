import {ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, Client, UserSelectMenuInteraction} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "twitch-add-role",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: Client) {

        const uuids = uuid();

        for (const value of interaction.values) {
            const role = interaction.guild?.roles.cache.get(value);

            await database.guildTwitchNotifications.updateMany(
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


            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Updated the ping role to ${role}`, interaction, true)
        }
    }
};
