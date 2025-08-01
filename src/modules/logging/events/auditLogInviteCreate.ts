import {
    Client,
    Events,
    Invite,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.InviteCreate,

    async execute(invite: Invite, client: ExtendedClient) {
        const guild = invite.guild;
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

        // Format invite details
        const inviteDetails = [
            `### New Invite Created`,
            ``,
            `> **Code**: \`${invite.code}\``,
            `> **Channel**: ${invite.channel?.toString() || "Unknown"}`,
            `> **Inviter**: ${inviter ? inviter.toString() : "Unknown"}`,
            `> **Max Uses**: \`${invite.maxUses || "Unlimited"}\``,
            `> **Expires**: \`${invite.expiresAt?.toLocaleString() || "Never"}\``,
            `> **Temporary**: \`${invite.temporary ? "Yes" : "No"}\``,
            ``,
            `- **Created at**: \`${new Date().toLocaleString()}\``
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
                    createdAt: new Date().toISOString(),
                    url: invite.url
                },
                inviter: inviter ? {
                    id: inviter.id,
                    username: inviter.username,
                    tag: inviter.tag,
                    avatarURL: inviter.displayAvatarURL()
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