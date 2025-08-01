import {
    AuditLogEvent,
    Events,
    Guild,
    GuildAuditLogsEntry,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildAuditLogEntryCreate,

    async execute(
        auditLogEntry: GuildAuditLogsEntry,
        guild: Guild,
        client: ExtendedClient
    ) {
        // Only handle member unban events
        if (auditLogEntry.action !== AuditLogEvent.MemberBanRemove) return;

        // Check if logging is enabled
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

        if (!loggingData?.Moderation) return;

        const webhook = new WebhookClient({url: loggingData.Moderation});

        try {
            const {executor, target, reason} = auditLogEntry;

            if (!executor || !target) return;

            // Get additional user details
            const unbannedUser = await client.users.fetch((target as Guild).id).catch(() => null);
            const moderator = await client.users.fetch(executor.id).catch(() => null);

            // Prepare the log message
            const messageContent = [
                `### Member Unbanned`,
                ``,
                `> **User**: ${unbannedUser ? unbannedUser.toString() : `\`${(target as Guild).id}\``}`,
                `> **User ID**: \`${(target as Guild).id}\``,
                `> **Moderator**: ${moderator ? moderator.toString() : `\`${executor.id}\``}`,
                `> **Reason**: \`${reason || "No reason provided"}\``,
                ``,
                `- **Unbanned at**: \`${new Date().toLocaleString()}\``
            ].join("\n");

            // Prepare the JSON data
            const jsonData = {
                unban: {
                    userId: (target as Guild).id,
                    userTag: unbannedUser?.tag,
                    reason: reason,
                    timestamp: new Date().toISOString()
                },
                moderator: moderator ? {
                    id: moderator.id,
                    username: moderator.username,
                    tag: moderator.tag,
                    avatarURL: moderator.displayAvatarURL()
                } : null,
                guild: {
                    id: guild.id,
                    name: guild.name
                }
            };

            await loggingHelper(client,
                messageContent,
                webhook,
                JSON.stringify(jsonData, null, 2),
                "MemberUnban"
            );
        } catch (error) {
            console.error("Error processing unban event:", error);
        }
    }
};