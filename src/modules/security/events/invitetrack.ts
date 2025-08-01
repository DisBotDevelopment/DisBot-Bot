import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, GuildMember} from "discord.js";
import {inviteTracker} from "../../../systems/inviteTracker/inviteTracker.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildMemberAdd,

    /**
     * @param {GuildMember} member
     * @param {ExtendedClient} client
     */
    async execute(member: GuildMember, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");

        const data = await database.securitys.findFirst
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

        const embed = new EmbedBuilder()
            .setTitle("Invite Tracked")
            .setDescription(
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
                ].join("\n")
            ).setTimestamp().setFooter(
                {
                    text: `@${invites.usedInvite?.inviter?.username}`,
                    iconURL: `${invites.usedInvite?.inviter?.displayAvatarURL()}`
                }
            )

        channel.send({
            embeds: [embed]
            , components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setEmoji("<:user:1259432940383768647>")
                        .setLabel("Open Member Profile")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/users/${member.id}`),
                    new ButtonBuilder()
                        .setEmoji("<:reopen:1289668008503148649>")
                        .setLabel("Open Member Safety")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/channels/${member.guild.id}/member-safety`)
                )
            ]
        });
    },
};
