import {
    Events,
    Invite,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.InviteCreate,

    async execute(invite: Invite, client: ExtendedClient) {
        const guild = invite.guild;
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

        const expiresTimestamp = invite.expiresAt
            ? Math.floor(invite.expiresAt.getTime() / 1000)
            : null;

        const message = [
            `### 📨 Invite Created`,
            ``,
            `### Inviter`,
            ...(inviter ? [
                `> <@${inviter.id}>`,
                `> **User ID:** \`${inviter.id}\``,
                `> **Username:** \`${inviter.tag}\``
            ] : [
                `> *Unknown Inviter*`
            ]),
            ``,
            `### Invite Details`,
            `> **Code:** \`${invite.code}\``,
            `> **URL:** ${invite.url}`,
            `> **Channel:** ${invite.channel ? `<#${invite.channel.id}>` : "\`Unknown\`"}`,
            `> **Max Uses:** \`${invite.maxUses || "Unlimited"}\``,
            `> **Temporary Membership:** \`${invite.temporary ? "Yes" : "No"}\``,
            ...(expiresTimestamp ? [
                `> **Expires:** <t:${expiresTimestamp}:F> (<t:${expiresTimestamp}:R>)`
            ] : [
                `> **Expires:** \`Never\``
            ]),
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
                    createdAt: new Date().toISOString(),
                    url: invite.url
                },
                inviter: inviter ? {
                    id: inviter.id,
                    username: inviter.username,
                    tag: inviter.tag
                } : null,
                guild: {
                    id: guild.id,
                    name: guild.name
                }
            }, null, 2),
            "InviteCreate"
        );
    }
};