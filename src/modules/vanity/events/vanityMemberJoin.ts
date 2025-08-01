import {EmbedBuilder, Events, GuildMember} from "discord.js";
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

        const data = await database.vanitys.findFirst({
            where: {
                GuildId: member.guild.id,
            }
        });
        if (!data) return;
        const invite = await inviteTracker(member, client);

        const vanityInvite = await database.vanitys.findFirst({
            include: {
                Analytics: {
                    include: {
                        Latest30Days: true
                    }
                },
            },
            where: {
                Invite: invite?.usedInvite?.url,
            }
        })
        if (!vanityInvite) return
        if (!vanityInvite.Analytics?.TrackMessageId) return;
        if (!vanityInvite.Analytics?.TrackInviteWithLog) return;

        await database.vanityAnalytics.update({
                where: {
                    VanityId: vanityInvite.UUID,
                },
                data: {
                    JoinedWithCode: +1
                }
            }
        )
        await database.analyticsLatest30Days.update({
                where: {
                    VanityAnalyticsId: vanityInvite.UUID,
                },
                data: {
                    JoinedWithCode: +1,
                }
            }
        )

        const message = await database.messageTemplates.findFirst({
            where: {
                Name: vanityInvite.Analytics?.TrackMessageId,
            }
        })

        if (message) {
            const channel = member.guild.channels.cache.get(vanityInvite.Analytics?.TrackInviteWithLog as string);
            if (channel && channel.isSendable()) {

                const msgContent = message.Content?.replace("{member.id}", member.id)
                    .replace("{member.username}", member.user.username)
                    .replace("{member.tag}", member.user.tag)
                    .replace("{member.avatar}", member.user.displayAvatarURL())
                    .replace("{invite.code}", invite?.usedInvite?.code as string)
                    .replace("{invite.uses}", invite?.usedInvite?.uses?.toString() ?? "0")
                    .replace("{vanity.slug}", vanityInvite.Slug as string)
                    .replace("{vanity.analitics.clicks}", vanityInvite.Analytics?.Click as unknown as string ?? "0")
                    .replace("{vanity.analitics.joined}", vanityInvite.Analytics?.JoinedWithCode?.toString() ?? "0")
                    .replace("{vanity.analitics.unique}", vanityInvite.Analytics?.UniqueClick as unknown as string ?? "0")
                    .replace("{vanity.analitics.last30days.clicks}", vanityInvite.Analytics?.Latest30Days?.Click?.toString() ?? "0")
                    .replace("{vanity.analitics.last30days.unique}", vanityInvite.Analytics?.Latest30Days?.UniqueClick?.toString() ?? "0")
                    .replace("{vanity.analitics.last30days.joined}", vanityInvite.Analytics?.Latest30Days?.JoinedWithCode?.toString() ?? "0")
                    .replace("{vanity.host}", vanityInvite.Host as string)
                    .replace("{inviter.id}", invite?.usedInvite?.inviter?.id ?? "Unknown")
                    .replace("{inviter.username}", invite?.usedInvite?.inviter?.username ?? "Unknown")
                    .replace("{inviter.tag}", invite?.usedInvite?.inviter?.tag ?? "Unknown")
                    .replace("{inviter.avatar}", invite?.usedInvite?.inviter?.displayAvatarURL() ?? "Unknown")

                if (message.EmbedJSON == null || message.EmbedJSON == "") {
                    channel.send(
                        {
                            content: msgContent
                        }
                    )
                } else {
                    const embedString = message.EmbedJSON?.replace("{member.id}", member.id)
                        .replace("{member.username}", member.user.username)
                        .replace("{member.tag}", member.user.tag)
                        .replace("https://i.imgur.com/kjEQRRI.png", member.user.displayAvatarURL())
                        .replace("{invite.code}", invite?.usedInvite?.code as string)
                        .replace("{invite.uses}", invite?.usedInvite?.uses?.toString() ?? "0")
                        .replace("{vanity.slug}", vanityInvite.Slug as string)
                        .replace("{vanity.host}", vanityInvite.Host as string)
                        .replace("{vanity.analitics.clicks}", vanityInvite.Analytics?.Click as unknown as string ?? "0")
                        .replace("{vanity.analitics.joined}", vanityInvite.Analytics?.JoinedWithCode?.toString() ?? "0")
                        .replace("{vanity.analitics.unique}", vanityInvite.Analytics?.UniqueClick as unknown as string ?? "0")
                        .replace("{vanity.analitics.last30days.clicks}", vanityInvite.Analytics?.Latest30Days?.Click?.toString() ?? "0")
                        .replace("{vanity.analitics.last30days.unique}", vanityInvite.Analytics?.Latest30Days?.UniqueClick?.toString() ?? "0")
                        .replace("{vanity.analitics.last30days.joined}", vanityInvite.Analytics?.Latest30Days?.JoinedWithCode?.toString() ?? "0")
                        .replace("{inviter.id}", invite?.usedInvite?.inviter?.id ?? "Unknown")
                        .replace("{inviter.username}", invite?.usedInvite?.inviter?.username ?? "Unknown")
                        .replace("{inviter.tag}", invite?.usedInvite?.inviter?.tag ?? "Unknown")
                        .replace("https://i.imgur.com/kjEQRRI.png", invite?.usedInvite?.inviter?.displayAvatarURL() ?? "Unknown")

                    channel.send(
                        {
                            content: msgContent,
                            embeds: [new EmbedBuilder(JSON.parse(embedString as string))]
                        }
                    )
                }
            }
        }

    },
}
;
