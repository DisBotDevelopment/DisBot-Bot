import {
    GuildDefaultMessageNotifications,
    GuildExplicitContentFilter,
    GuildVerificationLevel,
    Snowflake
} from 'discord.js';
import {AfkData} from "./AfkData.js";
import {BanData} from "./BanData.js";
import {ChannelsData} from "./ChannelsData.js";
import {EmojiData} from "./EmojiData.js";
import {MemberData} from './MemberData.js';
import {RoleData} from "./RoleData.js";
import {WidgetData} from "./WidgetData.js";

export interface BackupData {
    name: string;
    iconURL?: string;
    iconBase64?: string;
    verificationLevel: GuildVerificationLevel;
    explicitContentFilter: GuildExplicitContentFilter;
    defaultMessageNotifications: GuildDefaultMessageNotifications | number;
    afk?: AfkData;
    widget: WidgetData;
    splashURL?: string;
    splashBase64?: string;
    bannerURL?: string;
    bannerBase64?: string;
    channels: ChannelsData;
    roles: RoleData[];
    bans: BanData[];
    emojis: EmojiData[];
    members: MemberData[];
    createdTimestamp: number;
    guildID: string;
    id: Snowflake;
}
