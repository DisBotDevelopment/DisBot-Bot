import {
    AuditLogEvent,
    Events,
    Guild,
    GuildAuditLogsEntry,
    User,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    async execute(
        auditLogEntry: GuildAuditLogsEntry,
        guild: Guild,
        client: ExtendedClient
    ) {
        if (auditLogEntry.action !== AuditLogEvent.MemberBanAdd) return;

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

        if (!loggingData?.Moderation) return;

        const webhook = new WebhookClient({url: loggingData.Moderation});

        try {
            const {executor, target, reason} = auditLogEntry;

            if (!executor || !target) return;

            const targetUser = target as User;
            const bannedUser = await client.users.fetch(targetUser.id).catch(() => null);
            const moderator = await client.users.fetch(executor.id).catch(() => null);

            const message = [
                `### 🔨 Member Banned`,
                ``,
                `### Moderator`,
                ...(moderator ? [
                    `> <@${moderator.id}>`,
                    `> **User ID:** \`${moderator.id}\``,
                    `> **Username:** \`${moderator.tag}\``
                ] : [
                    `> *Unknown Moderator*`,
                    `> **User ID:** \`${executor.id}\``
                ]),
                ``,
                `### Banned User`,
                ...(bannedUser ? [
                    `> <@${bannedUser.id}>`,
                    `> **User ID:** \`${bannedUser.id}\``,
                    `> **Username:** \`${bannedUser.tag}\``
                ] : [
                    `> *Unknown User*`,
                    `> **User ID:** \`${targetUser.id}\``
                ]),
                ``,
                ...(reason ? [
                    `### Reason`,
                    `> ${reason}`,
                    ``
                ] : []),
                `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
            ].join("\n");

            await loggingHelper(
                client,
                message,
                webhook,
                JSON.stringify({
                    ban: {
                        userId: targetUser.id,
                        userTag: bannedUser?.tag,
                        username: bannedUser?.username,
                        reason: reason || null,
                        timestamp: new Date().toISOString()
                    },
                    moderator: {
                        id: executor.id,
                        username: moderator?.username,
                        tag: moderator?.tag || executor.tag
                    },
                    guild: {
                        id: guild.id,
                        name: guild.name
                    }
                }, null, 2),
                "MemberBan"
            );
        } catch (error) {
            console.error("Error processing ban event:", error);
        }
    }
};