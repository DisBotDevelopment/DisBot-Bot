import {ButtonInteraction, MessageFlags, TextInputStyle} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-invite-tracking",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");
        const data = await database.guildSecurity.findFirst({
            where: {
                GuildId: interaction.guildId
            }
        })

        if (data?.InviteLoggingActive != null) {

            await database.guildSecurity.update
            ({
                where: {
                    GuildId: interaction.guildId
                },
                data: {
                    InviteLoggingActive: null
                }
            });

            return await sendDefaultMessage(`## ${await convertToEmojiToPng("locate")} Invite Tracking has been disabled!`, interaction, true, "reply")

        } else {
            await database.guildSecurity.update
            ({
                where: {
                    GuildId: interaction.guildId
                },
                data: {
                    InviteLoggingActive: interaction.guild?.safetyAlertsChannelId ?? interaction.channelId
                }
            });

            return await sendDefaultMessage(`## ${await convertToEmojiToPng("locate")} Invite Tracking has been enabled in ${interaction.guild?.safetyAlertsChannel ?? interaction.channel}`, interaction, true, "reply")
        }
    }
};
