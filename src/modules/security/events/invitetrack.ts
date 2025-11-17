import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ContainerBuilder,
    EmbedBuilder,
    Events,
    GuildMember,
    MessageFlags, TextChannel, TextDisplayBuilder, WebhookClient
} from "discord.js";
import {inviteTracker} from "../../../systems/inviteTracker/inviteTracker.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.GuildMemberAdd,

    /**
     * @param {GuildMember} member
     * @param {ExtendedClient} client
     */
    async execute(member: GuildMember, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");

        const data = await database.guildSecurity.findFirst
        ({
            where: {
                GuildId: member.guild.id
            }
        });

        if (!data || !data.InviteLoggingActive) return;
        if (!member.guild.available) return;

        const channel = member.guild.channels.cache.get(data.InviteLoggingActive);
        if (!channel || !channel.isTextBased()) return;

        const invites = await inviteTracker(member, client);

        if (!invites) return;


        const webhook = await (channel as TextChannel).createWebhook({
            name: "Invite Logging",
            avatar: member.displayAvatarURL()
        })

        const webhookClient = new WebhookClient({
            url: webhook.url
        });

        await loggingHelper(
            client,
            [
                `> **Invite Uses:** ${invites.usedInvite?.uses}`,
                `> **Inviter:** <@${invites.usedInvite?.inviter?.id}>`,
                `> **Invite Code:** \`${invites.usedInvite?.code}\``,
                `> **Invite Link:** [Click Here](https://discord.gg/${invites.usedInvite?.code})`,
                `> **Invite Type:** ${invites.type}`,
                ``,
                `> **Member ID:** \`${member.id}\``,
                `> **Member Tag:** \`${member.user.tag}\``,
                `> **Member Created At:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
                `> **Member Joined At:** <t:${Math.floor(member.joinedTimestamp as number / 1000)}:R>`,
            ].join("\n"),
            webhookClient,
            JSON.stringify(
                {
                    member: member,
                }
            ),
            "invite_logging"
        )

        webhook.delete("Invite has been logged.")

    }
}

