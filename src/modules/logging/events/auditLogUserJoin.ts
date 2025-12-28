import {
    Events,
    GuildMember,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildMemberAdd,

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

        const accountCreatedTimestamp = Math.floor(user.createdTimestamp / 1000);
        const joinedTimestamp = member.joinedTimestamp
            ? Math.floor(member.joinedTimestamp / 1000)
            : Math.floor(Date.now() / 1000);

        const accountAge = Date.now() - user.createdTimestamp;
        const accountAgeDays = Math.floor(accountAge / (1000 * 60 * 60 * 24));

        const message = [
            `### ➕ Member Joined`,
            ``,
            `### User`,
            `> <@${user.id}>`,
            `> **User ID:** \`${user.id}\``,
            `> **Username:** \`${user.tag}\``,
            `> **Bot:** \`${user.bot ? "Yes" : "No"}\``,
            ``,
            `### Join Details`,
            `> **Account Created:** <t:${accountCreatedTimestamp}:F> (<t:${accountCreatedTimestamp}:R>)`,
            `> **Account Age:** \`${accountAgeDays} days\``,
            `> **Joined Server:** <t:${joinedTimestamp}:F> (<t:${joinedTimestamp}:R>)`,
            `> **Member Count:** \`${guild.memberCount}\``,
            ...(member.pending ? [
                `> **Pending:** \`Yes (Membership Screening)\``
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
                    pending: member.pending
                },
                guild: {
                    id: guild.id,
                    name: guild.name,
                    memberCount: guild.memberCount
                },
                accountAgeDays: accountAgeDays
            }, null, 2),
            "GuildMemberAdd"
        );
    }
};