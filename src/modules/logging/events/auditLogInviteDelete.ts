import {
    AuditLogEvent,
    Events, Guild,
    Invite,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.InviteDelete,

    async execute(invite: Invite, client: ExtendedClient) {
        const guild = invite.guild as Guild;
        if (!guild) {
            console.error("Guild not found for invite:", invite.code);
            return;
        }

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

        if (!loggingData?.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});
        const inviter = invite.inviter;

        // Try to fetch audit logs to find who deleted the invite
        let deleter = null;
        try {
            const auditLogs = await guild.fetchAuditLogs({
                type: AuditLogEvent.InviteDelete,
                limit: 1
            });
            deleter = auditLogs.entries.first()?.executor;
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
        }

        // Format invite details
        const inviteDetails = [
            `### Invite Deleted`,
            ``,
            `> **Code**: \`${invite.code}\``,
            `> **Channel**: ${invite.channel?.toString() || "Unknown"}`,
            `> **Original Inviter**: ${inviter ? inviter.toString() : "Unknown"}`,
            `> **Max Uses**: \`${invite.maxUses || "Unlimited"}\``,
            `> **Expired**: \`${invite.expiresAt && invite.expiresAt < new Date() ? "Yes" : "No"}\``,
            `> **Temporary**: \`${invite.temporary ? "Yes" : "No"}\``,
            ``,
            `- **Deleted by**: ${deleter ? deleter.toString() : "Unknown"}`,
            `- **Deleted at**: \`${new Date().toLocaleString()}\``,
            `- **Created at**: \`${invite.createdAt?.toLocaleString() || "Unknown"}\``
        ];

        await loggingHelper(client,
            inviteDetails.join("\n"),
            webhook,
            JSON.stringify({
                invite: {
                    code: invite.code,
                    channelId: invite.channel?.id,
                    channelName: invite.channel?.name,
                    inviterId: inviter?.id,
                    maxUses: invite.maxUses,
                    expiresAt: invite.expiresAt?.toISOString(),
                    temporary: invite.temporary,
                    createdAt: invite.createdAt?.toISOString(),
                    deletedAt: new Date().toISOString(),
                    url: `https://discord.gg/${invite.code}`
                },
                inviter: inviter ? {
                    id: inviter.id,
                    username: inviter.username,
                    tag: inviter.tag,
                    avatarURL: inviter.displayAvatarURL()
                } : null,
                deleter: deleter ? {
                    id: deleter.id,
                    username: deleter.username,
                    tag: deleter.tag,
                    avatarURL: deleter.displayAvatarURL()
                } : null,
                guild: {
                    id: guild.id,
                    name: guild.name
                },
                deletionDetails: {
                    wasExpired: invite.expiresAt && invite.expiresAt < new Date(),
                    wasTemporary: invite.temporary
                }
            }, null, 2),
            "InviteDelete"
        );
    }
};