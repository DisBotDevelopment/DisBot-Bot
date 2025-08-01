import {
    Events,
    GuildMember,
    time,
    TimestampStyles,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildMemberRemove,

    /**
     * @param {GuildMember} member
     * @param {ExtendedClient} client
     */
    async execute(member: GuildMember, client: ExtendedClient) {
        const {guild, user} = member;
        const leaveTime = new Date();

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled?.LoggingEnabled) return;

        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!loggingData?.Member) return;

        const webhook = new WebhookClient({url: loggingData.Member});

        await loggingHelper(client,
            [
                "### Member Left",
                "",
                `> **User:** ${member} (\`${user.tag}\`)`,
                `> **Account Created:** \`${user.createdAt.toLocaleString()}\``,
                `> **Joined Server:** ${time(member.joinedAt as Date, TimestampStyles.RelativeTime)}`,
                `> **Left Server:** \`${leaveTime.toLocaleString()}\``,
                `> **Member Count:** \`${guild.memberCount}\``,
                "",
                `-# **User ID:** ${user.id}`,
                `-# **Bot:** ${user.bot ? "Yes" : "No"}`,
                `-# **Roles:** ${member.roles.cache.size - 1}` // Subtract 1 for @everyone
            ].join("\n"),
            webhook,
            JSON.stringify({
                user: {
                    id: user.id,
                    username: user.username,
                    discriminator: user.discriminator,
                    bot: user.bot,
                    createdTimestamp: user.createdTimestamp
                },
                member: {
                    joinedTimestamp: member.joinedTimestamp,
                    roles: member.roles.cache.map(role => role.id),
                    nickname: member.nickname
                },
                guild: {
                    memberCount: guild.memberCount
                },
                leaveTime: leaveTime.toISOString()
            }),
            "GuildMemberRemove"
        );
    }
};