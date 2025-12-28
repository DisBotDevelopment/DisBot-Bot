import {
    AuditLogEvent,
    Events,
    GuildMember,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled?.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!loggingData?.Member) return;

        const webhook = new WebhookClient({url: loggingData.Member});

        let removalType = "Left";
        let executor = null;

        try {
            const kickLogs = await guild.fetchAuditLogs({
                type: AuditLogEvent.MemberKick,
                limit: 1
            });
            const kickEntry = kickLogs.entries.first();
            if (kickEntry && kickEntry.target?.id === user.id && kickEntry.createdTimestamp > Date.now() - 5000) {
                removalType = "Kicked";
                executor = kickEntry.executor;
            }
        } catch (error) {
            console.error("Failed to fetch kick audit logs:", error);
        }

        if (removalType === "Left") {
            try {
                const banLogs = await guild.fetchAuditLogs({
                    type: AuditLogEvent.MemberBanAdd,
                    limit: 1
                });
                const banEntry = banLogs.entries.first();
                if (banEntry && banEntry.target?.id === user.id && banEntry.createdTimestamp > Date.now() - 5000) {
                    removalType = "Banned";
                    executor = banEntry.executor;
                }
            } catch (error) {
                console.error("Failed to fetch ban audit logs:", error);
            }
        }

        const accountCreatedTimestamp = Math.floor(user.createdTimestamp / 1000);
        const joinedTimestamp = member.joinedTimestamp
            ? Math.floor(member.joinedTimestamp / 1000)
            : null;

        const membershipDuration = member.joinedTimestamp
            ? Date.now() - member.joinedTimestamp
            : null;
        const membershipDays = membershipDuration
            ? Math.floor(membershipDuration / (1000 * 60 * 60 * 24))
            : null;

        const roles = member.roles.cache.filter(role => role.id !== guild.id);

        const message = [
            `### ➖ Member ${removalType}`,
            ``,
            ...(executor ? [
                `### ${removalType} By`,
                `> <@${executor.id}>`,
                `> **User ID:** \`${executor.id}\``,
                `> **Username:** \`${executor.tag}\``,
                ``
            ] : []),
            `### User`,
            `> <@${user.id}>`,
            `> **User ID:** \`${user.id}\``,
            `> **Username:** \`${user.tag}\``,
            `> **Bot:** \`${user.bot ? "Yes" : "No"}\``,
            ...(member.nickname ? [
                `> **Nickname:** \`${member.nickname}\``
            ] : []),
            ``,
            `### Membership Details`,
            `> **Account Created:** <t:${accountCreatedTimestamp}:F> (<t:${accountCreatedTimestamp}:R>)`,
            ...(joinedTimestamp ? [
                `> **Joined Server:** <t:${joinedTimestamp}:F> (<t:${joinedTimestamp}:R>)`,
                `> **Time in Server:** \`${membershipDays} days\``
            ] : []),
            `> **Member Count:** \`${guild.memberCount}\``,
            `> **Roles:** \`${roles.size}\``,
            ...(roles.size > 0 && roles.size <= 10 ? [
                `> ${roles.map(r => r.toString()).join(", ")}`
            ] : []),
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                user: {
                    id: user.id,
                    username: user.username,
                    tag: user.tag,
                    bot: user.bot,
                    createdTimestamp: user.createdTimestamp,
                    createdAt: user.createdAt.toISOString()
                },
                member: {
                    joinedTimestamp: member.joinedTimestamp,
                    joinedAt: member.joinedAt?.toISOString(),
                    nickname: member.nickname,
                    roles: roles.map(role => ({id: role.id, name: role.name})),
                    membershipDays: membershipDays
                },
                removal: {
                    type: removalType,
                    executor: executor ? {
                        id: executor.id,
                        username: executor.username,
                        tag: executor.tag
                    } : null
                },
                guild: {
                    id: guild.id,
                    name: guild.name,
                    memberCount: guild.memberCount
                },
                leftAt: new Date().toISOString()
            }, null, 2),
            "GuildMemberRemove"
        );
    }
};