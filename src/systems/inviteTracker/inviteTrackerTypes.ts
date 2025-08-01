import type {Guild, Snowflake, User} from "discord.js";

export interface ExemptGuildFunction {
    (guild: Guild): boolean
}

export interface InvitesTrackerOptions {
    fetchGuilds: boolean;
    fetchAuditLogs: boolean;
    fetchVanity: boolean;
    exemptGuild?: ExemptGuildFunction;
    activeGuilds?: Snowflake[];
}

export interface InviteData {
    guildId: Snowflake;
    code: string;
    url: string;
    uses: number | null;
    maxUses: number | null;
    maxAge: number | null;
    createdTimestamp: number | null;
    inviter: User | null;
}

export interface VanityInviteData {
    code: string | null;
    uses: number | null;
}

export interface DeletedInviteData extends InviteData {
    deleted?: boolean;
    deletedTimestamp?: number;
}

export type TrackedInviteData = DeletedInviteData & InviteData;