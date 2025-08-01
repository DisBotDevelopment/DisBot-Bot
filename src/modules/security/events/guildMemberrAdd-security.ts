import {Events, GuildMember} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildMemberAdd,

    /**
     * @param {GuildMember} member
     * @param {ExtendedClient} client
     */

    async execute(member: GuildMember, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");

        const data = await database.securitys.findFirst
        ({
            where: {
                GuildId: member.guild.id
            }
        });

        if (!data) return;
        if (!data.MaxAccountAge) return;

        const accountAge = Date.now() - member.user.createdAt.getTime();

        if (accountAge < data.MaxAccountAge * 24 * 60 * 60 * 1000) {
            member.guild.safetyAlertsChannel?.send(
                `${await convertToEmojiPng("warn", client.user.id)} **Security Alert**: User ${member.user.tag} (${member.id}) has been kicked for having an account age of less than ${data.MaxAccountAge} days.`
            )
            await member.kick("Account age is below the threshold set by the security gate.");
        } else {

        }


    }
};
