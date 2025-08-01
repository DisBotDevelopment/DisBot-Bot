import { BackupData } from "./types/BackupData.js";
import { LoadOptions } from "./types/LoadOptions.js";
import { loadCategory, loadChannel } from "./util.js";
import type { ForumChannel, NewsChannel, TextChannel, VoiceBasedChannel } from 'discord.js';
import { ChannelType, Emoji, Guild, GuildFeature, Role, VoiceChannel } from 'discord.js';

/**
 * Restores the guild configuration
 */
export const loadConfig = (guild: Guild, backupData: BackupData): Promise<Guild[]> => {
    const configPromises: Promise<Guild>[] = [];
    if (backupData.name) {
        configPromises.push(guild.setName(backupData.name));
    }
    if (backupData.iconBase64) {
        configPromises.push(guild.setIcon(Buffer.from(backupData.iconBase64, 'base64')));
    } else if (backupData.iconURL) {
        configPromises.push(guild.setIcon(backupData.iconURL));
    }
    if (backupData.splashBase64) {
        configPromises.push(guild.setSplash(Buffer.from(backupData.splashBase64, 'base64')));
    } else if (backupData.splashURL) {
        configPromises.push(guild.setSplash(backupData.splashURL));
    }
    if (backupData.bannerBase64) {
        configPromises.push(guild.setBanner(Buffer.from(backupData.bannerBase64, 'base64')));
    } else if (backupData.bannerURL) {
        configPromises.push(guild.setBanner(backupData.bannerURL));
    }
    if (backupData.verificationLevel) {
        configPromises.push(guild.setVerificationLevel(backupData.verificationLevel));
    }
    if (backupData.defaultMessageNotifications) {
        configPromises.push(guild.setDefaultMessageNotifications(backupData.defaultMessageNotifications));
    }
    const changeableExplicitLevel = guild.features.includes(GuildFeature.Community);
    if (backupData.explicitContentFilter && changeableExplicitLevel) {
        configPromises.push(guild.setExplicitContentFilter(backupData.explicitContentFilter));
    }
    return Promise.all(configPromises);
};

/**
 * Restore the guild roles
 */
export const loadRoles = (guild: Guild, backupData: BackupData): Promise<Role[]> => {
    const rolePromises: Promise<Role>[] = [];

    backupData.roles?.forEach((roleData: {
        isEveryone: any;
        name: any;
        color: any;
        permissions: string | number | bigint | boolean;
        mentionable: any;
        hoist: any;
    }) => {
        if (roleData.isEveryone) {
            const everyoneRole = guild.roles.cache.get(guild.id);
            if (everyoneRole) {
                rolePromises.push(
                    everyoneRole.edit({
                        name: roleData.name,
                        color: roleData.color,
                        permissions: BigInt(roleData.permissions),
                        mentionable: roleData.mentionable
                    })
                );
            }
        } else {
            rolePromises.push(
                guild.roles.create({
                    name: roleData.name,
                    color: roleData.color,
                    hoist: roleData.hoist,
                    permissions: BigInt(roleData.permissions),
                    mentionable: roleData.mentionable
                })
            );
        }
    });
    return Promise.all(rolePromises);
};

/**
 * Restore the guild channels
 */
export const loadChannels = (guild: Guild, backupData: BackupData, options: LoadOptions): Promise<unknown[]> => {
    const loadChannelPromises: Promise<void | unknown>[] = [];
    backupData.channels.categories.forEach((categoryData: any) => {
        loadChannelPromises.push(
            new Promise((resolve) => {
                loadCategory(categoryData, guild).then((createdCategory) => {
                    categoryData.children.forEach((channelData: any) => {
                        loadChannel(channelData, guild, createdCategory, options);
                        resolve(true);
                    });
                });
            })
        );
    });
    backupData.channels.others.forEach((channelData: any) => {
        loadChannelPromises.push(loadChannel(channelData, guild, undefined, options));
    });
    return Promise.all(loadChannelPromises);
};

/**
 * Restore the afk configuration
 */
export const loadAFK = (guild: Guild, backupData: BackupData): Promise<Guild[]> => {
    const afkPromises: Promise<Guild>[] = [];
    if (backupData.afk) {
        afkPromises.push(guild.setAFKChannel(guild.channels.cache.find((ch) => ch.name === backupData.afk?.name && ch.type === ChannelType.GuildVoice) as VoiceChannel));
        afkPromises.push(guild.setAFKTimeout(backupData.afk.timeout));
    }
    return Promise.all(afkPromises);
};

/**
 * Restore guild emojis
 */
export const loadEmojis = (guild: Guild, backupData: BackupData): Promise<Emoji[]> => {
    const emojiPromises: Promise<Emoji>[] = [];
    backupData.emojis.forEach((emoji: any) => {
        if (emoji.url) {
            emojiPromises.push(guild.emojis.create({
                name: emoji.name,
                attachment: emoji.url
            }));
        } else if (emoji.base64) {
            emojiPromises.push(guild.emojis.create({
                name: emoji.name,
                attachment: Buffer.from(emoji.base64, 'base64')
            }));
        }
    });
    return Promise.all(emojiPromises);
};

/**
 * Restore guild bans
 */
export const loadBans = (guild: Guild, backupData: BackupData): Promise<string[]> => {
    const banPromises: Promise<string>[] = [];
    backupData.bans.forEach((ban: any) => {
        banPromises.push(
            guild.members.ban(ban.id, {
                reason: ban.reason
            }) as Promise<string>
        );
    });
    return Promise.all(banPromises);
};

/**
 * Restore embedChannel configuration
 */
export const loadEmbedChannel = (guild: Guild, backupData: BackupData): Promise<Guild[]> => {
    const embedChannelPromises: Promise<Guild>[] = [];
    if (backupData.widget.channel) {
        embedChannelPromises.push(
            guild.setWidgetSettings({
                enabled: backupData.widget.enabled,
                channel: guild.channels.cache.find((ch) => ch.name === backupData.widget.channel) as NewsChannel | TextChannel | ForumChannel | VoiceBasedChannel
            })
        );
    }
    return Promise.all(embedChannelPromises);
};