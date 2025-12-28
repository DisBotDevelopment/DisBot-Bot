import {
    AuditLogEvent,
    Events,
    Guild,
    Invite,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.InviteDelete,

    async execute(invite: Invite, client: ExtendedClient) {
        const guild = invite.guild as Guild;
        if (!guild) return;

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

        if (!loggingData?.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});
        const inviter = invite.inviter;

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

        const wasExpired = invite.expiresAt && invite.expiresAt < new Date();
        const createdTimestamp = invite.createdAt
            ? Math.floor(invite.createdAt.getTime() / 1000)
            : null;

        const message = [
            `### 🗑️ Invite Deleted`,
            ``,
            ...(deleter ? [
                `### Deleted By`,
                `> <@${deleter.id}>`,
                `> **User ID:** \`${deleter.id}\``,
                `> **Username:** \`${deleter.tag}\``,
                ``
            ] : []),
            `### Deleted Invite`,
            `> **Code:** \`${invite.code}\``,
            `> **URL:** https://discord.gg/${invite.code}`,
            `> **Channel:** ${invite.channel ? `<#${invite.channel.id}>` : "\`Unknown\`"}`,
            `> **Original Inviter:** ${inviter ? `<@${inviter.id}>` : "\`Unknown\`"}`,
            `> **Max Uses:** \`${invite.maxUses || "Unlimited"}\``,
            `> **Temporary Membership:** \`${invite.temporary ? "Yes" : "No"}\``,
            `> **Was Expired:** \`${wasExpired ? "Yes" : "No"}\``,
            ...(createdTimestamp ? [
                `> **Created:** <t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`
            ] : []),
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
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
                    tag: inviter.tag
                } : null,
                deleter: deleter ? {
                    id: deleter.id,
                    username: deleter.username,
                    tag: deleter.tag
                } : null,
                guild: {
                    id: guild.id,
                    name: guild.name
                },
                deletionDetails: {
                    wasExpired: wasExpired,
                    wasTemporary: invite.temporary
                }
            }, null, 2),
            "InviteDelete"
        );
    }
};