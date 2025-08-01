import {mapInviteData} from "./guildFetcher.js";
import {InviteData, TrackedInviteData} from "./inviteTrackerTypes.js";
import {ExtendedClient} from "../../types/client.js";
import {Collection, type Guild, GuildFeature, type GuildMember, type Invite, PermissionFlagsBits,} from "discord.js";

export async function inviteTracker(member: GuildMember, client: ExtendedClient): Promise<{
    guildMember: GuildMember,
    type: 'normal' | 'vanity' | 'unknown',
    usedInvite: InviteData | null
} | undefined> {

    if (member.partial) return;
    if (!client.guilds.cache.has(member.guild.id)) return;

    const currentInvites = await member.guild.invites.fetch().catch(() => new Collection()) as Collection<string, Invite>;
    const currentInvitesData = new Collection<string, TrackedInviteData>();
    currentInvites.forEach((invite) => {
        currentInvitesData.set(invite.code, mapInviteData(invite));
    });
    if (!currentInvites) return
    const cachedInvites = client.inviteTracker.invitesCache.get(member.guild.id);
    client.inviteTracker.invitesCache.set(member.guild.id, currentInvitesData);
    client.inviteTracker.invitesCacheUpdates.set(member.guild.id, Date.now());
    if (!cachedInvites) {
        return;
    }

    const usedInvites = compareInvitesCache(cachedInvites, currentInvitesData);

    let isVanity = false;
    if (usedInvites.length === 0 && member.guild.features.includes(GuildFeature.VanityURL)) {
        const vanityInvite = await member.guild.fetchVanityData();
        const vanityInviteCache = client.inviteTracker.vanityInvitesCache.get(member.guild.id);
        client.inviteTracker.vanityInvitesCache.set(member.guild.id, vanityInvite);
        if (vanityInviteCache) {
            if (vanityInviteCache.uses! < vanityInvite.uses!) isVanity = true;
        }
    }

    const type = isVanity ? 'vanity' : usedInvites[0] ? 'normal' : 'unknown'
    const usedInvite = usedInvites[0] ?? null;
    const guildMember = member;

    return {
        guildMember,
        type,
        usedInvite
    }
}

export const compareInvitesCache = (cachedInvites: Collection<string, TrackedInviteData>, currentInvites: Collection<string, TrackedInviteData>): TrackedInviteData[] => {
    const invitesUsed: InviteData[] = [];
    currentInvites.forEach((invite) => {
        if (
            invite.uses !== 0
            && cachedInvites.get(invite.code)
            && cachedInvites.get(invite.code)!.uses! < invite.uses!
        ) {
            invitesUsed.push(invite);
        }
    });
    if (invitesUsed.length < 1) {
        cachedInvites.sort((a, b) => ((a.deletedTimestamp && b.deletedTimestamp) ? b.deletedTimestamp - a.deletedTimestamp : 0)).forEach((invite) => {
            if (
                !currentInvites.get(invite.code)
                && invite.maxUses! > 0
                && invite.uses === (invite.maxUses! - 1)
            ) {
                invitesUsed.push(invite);
            }
        });
    }
    return invitesUsed;
};

export function fetchGuildCache(client: ExtendedClient, guild: Guild, useCache: boolean = false): Promise<void> {
    return new Promise((resolve) => {
        guild.fetch().then(() => {
            guild.members.me!.fetch().then(() => {
                if (client.inviteTracker.invitesCache.has(guild.id) && useCache) return resolve();
                if (guild.members.me!.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    guild.invites.fetch().then((invites) => {
                        const invitesData = new Collection<string, TrackedInviteData>();
                        invites.forEach((invite) => {
                            invitesData.set(invite.code, mapInviteData(invite));
                        });
                        client.inviteTracker.invitesCache.set(guild.id, invitesData);
                        client.inviteTracker.invitesCacheUpdates.set(guild.id, Date.now());
                        if (guild.features.includes(GuildFeature.VanityURL)) {
                            guild.fetchVanityData().then((vanityInvite) => {
                                client.inviteTracker.vanityInvitesCache.set(guild.id, vanityInvite);
                                resolve();
                            });
                        } else resolve();
                    }).catch(() => resolve());
                } else resolve();
            });
        }).catch(() => resolve());
    });
}