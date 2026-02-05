import {TrackedInviteData} from "./inviteTrackerTypes.js";
import {ExtendedClient} from "../../types/ExtendedClient.js";
import {Collection, type Guild, GuildFeature, type Invite, PermissionFlagsBits} from "discord.js";

export async function guildFetcher(client: ExtendedClient, guild: Guild, useCache: boolean = false) {
    return new Promise((resolve) => {
        guild.fetch().then(() => {
            guild.members.me!.fetch().then(() => {
                if (client.inviteTrackerInvitesCache.has(guild.id) && useCache) return;
                if (guild.members.me!.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    guild.invites.fetch().then((invites) => {
                        const invitesData = new Collection<string, TrackedInviteData>();
                        invites.forEach((invite) => {
                            invitesData.set(invite.code, mapInviteData(invite));
                        });
                        client.inviteTrackerInvitesCache.set(guild.id, invitesData);
                        client.inviteTrackerInvitesCacheUpdates.set(guild.id, Date.now());
                        if (guild.features.includes(GuildFeature.VanityURL)) {
                            guild.fetchVanityData().then((vanityInvite) => {
                                client.inviteTrackerVanityInvitesCache.set(guild.id, vanityInvite);
                                return;
                            });
                        } else return;
                    }).catch(() => {
                    });
                } else return;
            });
        }).catch(() => {
        });
    });
}

export function mapInviteData(invite: Invite): TrackedInviteData {
    return {
        guildId: invite.guild!.id,
        code: invite.code,
        url: invite.url,
        uses: invite.uses,
        maxUses: invite.maxUses,
        maxAge: invite.maxAge,
        createdTimestamp: invite.createdTimestamp,
        inviter: invite.inviter
    };
}
