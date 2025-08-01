import {ButtonInteraction, MessageFlags, TextInputStyle} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-invite-tracking",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");
        const data = await database.securitys.findFirst({
            where: {
                GuildId: interaction.guildId
            }
        })

        if (data?.InviteLoggingActive != null) {

            await database.securitys.update
            ({
                where: {
                    GuildId: interaction.guildId
                },
                data: {
                    InviteLoggingActive: null
                }
            });

            await interaction.reply(
                {
                    content: `## ${await convertToEmojiPng("locate", client.user.id)} Invite Tracking has been disabled!`,
                    flags: MessageFlags.Ephemeral
                }
            )

        } else {
            await database.securitys.update
            ({
                where: {
                    GuildId: interaction.guildId
                },
                data: {
                    InviteLoggingActive: interaction.guild?.safetyAlertsChannelId ?? interaction.channelId
                }
            });

            await interaction.reply(
                {
                    content: `## ${await convertToEmojiPng("locate", client.user.id)} Invite Tracking has been enabled in ${interaction.guild?.safetyAlertsChannel ?? interaction.channel}`,
                    flags: MessageFlags.Ephemeral
                }
            )

        }


    }
};
