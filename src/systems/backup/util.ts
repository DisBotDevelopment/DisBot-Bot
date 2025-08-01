import {
    AttachmentBuilder,
    CategoryChannel,
    ChannelType,
    Collection,
    FetchMessagesOptions,
    Guild,
    GuildChannelCreateOptions,
    GuildDefaultMessageNotifications,
    GuildExplicitContentFilter,
    GuildFeature,
    GuildPremiumTier,
    GuildSystemChannelFlags,
    GuildVerificationLevel,
    Message,
    NewsChannel,
    OverwriteData,
    OverwriteType,
    Snowflake,
    TextChannel,
    ThreadChannel,
    VoiceChannel,
    Webhook
} from 'discord.js';
import nodeFetch from 'node-fetch';
import type {CategoryData} from "./types/CategoryData.js";
import type {ChannelPermissionsData} from "./types/ChannelPermissionData.js";
import type {CreateOptions} from "./types/CreateOptions.js";
import type {LoadOptions} from "./types/LoadOptions.js";
import type {MessageData} from "./types/MessageData.js";
import type {TextChannelData} from "./types/TextChannelData.js";
import type {ThreadChannelData} from "./types/ThreadChannelData.js";
import type {VoiceChannelData} from "./types/VoiceChannelData.js";


const MaxBitratePerTier: Record<GuildPremiumTier, number> = {
    [GuildPremiumTier.None]: 64000,
    [GuildPremiumTier.Tier1]: 128000,
    [GuildPremiumTier.Tier2]: 256000,
    [GuildPremiumTier.Tier3]: 384000
};

/**
 * Gets the permissions for a channel
 */
export function fetchChannelPermissions(channel: TextChannel | VoiceChannel | CategoryChannel | NewsChannel) {
    const permissions: ChannelPermissionsData[] = [];
    channel.permissionOverwrites.cache
        .filter((p) => p.type === OverwriteType.Role)
        .forEach((perm) => {
            // For each overwrites permission
            const role = channel.guild.roles.cache.get(perm.id);
            if (role) {
                permissions.push({
                    roleName: role.name,
                    allow: perm.allow.bitfield.toString(),
                    deny: perm.deny.bitfield.toString()
                });
            }
        });
    return permissions;
}

/**
 * Fetches the voice channel data that is necessary for the backup
 */
export async function fetchVoiceChannelData(channel: VoiceChannel) {
    return new Promise<VoiceChannelData>(async (resolve) => {
        const channelData: VoiceChannelData = {
            type: ChannelType.GuildVoice,
            name: channel.name,
            bitrate: channel.bitrate,
            userLimit: channel.userLimit,
            parent: channel.parent ? channel.parent.name : undefined,
            permissions: fetchChannelPermissions(channel)
        };
        /* Return channel data */
        resolve(channelData);
    });
}

export async function fetchChannelMessages(channel: TextChannel | NewsChannel | ThreadChannel, options: CreateOptions): Promise<MessageData[]> {
    let messages: MessageData[] = [];
    const messageCount: number = isNaN(options.maxMessagesPerChannel ?? NaN) ? 10 : options.maxMessagesPerChannel!;
    const fetchOptions: FetchMessagesOptions = {limit: 100};
    let lastMessageId: Snowflake | undefined = undefined;
    let fetchComplete: boolean = false;
    while (!fetchComplete) {
        if (lastMessageId) {
            fetchOptions.before = lastMessageId;
        }
        const fetched: Collection<Snowflake, Message> = await channel.messages.fetch(fetchOptions);
        if (fetched.size === 0) {
            break;
        }
        lastMessageId = fetched.last()?.id;
        await Promise.all(fetched.map(async (msg) => {
            if (!msg.author || messages.length >= messageCount) {
                fetchComplete = true;
                return;
            }
            const files = await Promise.all(msg.attachments.map(async (a) => {
                let attach = a.url
                if (a.url && ['png', 'jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi'].includes(a.url)) {
                    if (options.saveImages && options.saveImages === 'base64') {
                        attach = (await (nodeFetch(a.url).then((res) => res.buffer()))).toString('base64')
                    }
                }
                return {
                    name: a.name,
                    attachment: attach
                };
            }))
            messages.push({
                username: msg.author.username,
                avatar: msg.author.displayAvatarURL(),
                content: msg.cleanContent,
                embeds: msg.embeds.map(embed => embed.toJSON()),
                files,
                pinned: msg.pinned,
                sentAt: msg.createdAt.toISOString(),
            });
        }));
    }

    return messages;
}

/**
 * Fetches the text channel data that is necessary for the backup
 */
export async function fetchTextChannelData(channel: TextChannel | NewsChannel, options: CreateOptions) {
    return new Promise<TextChannelData>(async (resolve) => {
        const channelData: TextChannelData = {
            type: channel.type,
            name: channel.name,
            nsfw: channel.nsfw,
            rateLimitPerUser: channel.type === ChannelType.GuildText ? channel.rateLimitPerUser : undefined,
            parent: channel.parent ? channel.parent.name : undefined,
            topic: channel.topic ?? undefined,
            permissions: fetchChannelPermissions(channel),
            messages: [],
            isNews: channel.type === ChannelType.GuildNews,
            threads: []
        };
        /* Fetch channel threads */
        if (channel.threads.cache.size > 0) {
            await Promise.all(channel.threads.cache.map(async (thread) => {
                const threadData: ThreadChannelData = {
                    type: thread.type,
                    name: thread.name,
                    archived: thread.archived ? true : false,
                    autoArchiveDuration: thread.autoArchiveDuration ? thread.autoArchiveDuration : 1440,
                    locked: thread.locked ? true : false,
                    rateLimitPerUser: thread.rateLimitPerUser ?? 0,
                    messages: []
                };
                try {
                    threadData.messages = await fetchChannelMessages(thread, options);
                    /* Return thread data */
                    channelData.threads.push(threadData);
                } catch {
                    channelData.threads.push(threadData);
                }
            }));
        }
        /* Fetch channel messages */
        try {
            channelData.messages = await fetchChannelMessages(channel, options);

            /* Return channel data */
            resolve(channelData);
        } catch {
            resolve(channelData);
        }
    });
}

/**
 * Creates a category for the guild
 */
export async function loadCategory(categoryData: CategoryData, guild: Guild) {
    return new Promise<CategoryChannel>((resolve) => {
        guild.channels.create({
            name: categoryData.name,
            type: ChannelType.GuildCategory
        }).then(async (category) => {
            // When the category is created
            const finalPermissions: OverwriteData[] = [];
            categoryData.permissions.forEach((perm) => {
                const role = guild.roles.cache.find((r) => r.name === perm.roleName);
                if (role) {
                    finalPermissions.push({
                        id: role.id,
                        allow: BigInt(perm.allow),
                        deny: BigInt(perm.deny)
                    });
                }
            });
            await category.permissionOverwrites.set(finalPermissions);
            resolve(category); // Return the category
        });
    });
}

/**
 * Create a channel and returns it
 */
export async function loadChannel(
    channelData: TextChannelData | VoiceChannelData,
    guild: Guild,
    category?: CategoryChannel,
    options?: LoadOptions
) {
    return new Promise(async (resolve) => {

        const loadMessages = (channel: TextChannel | ThreadChannel, messages: MessageData[], previousWebhook?: Webhook): Promise<Webhook | void> => {
            return new Promise(async (resolve) => {
                const webhook = previousWebhook || await (channel as TextChannel).createWebhook({
                    name: 'MessagesBackup',
                    avatar: channel.client.user.displayAvatarURL()
                }).catch(() => {
                });
                if (!webhook) return resolve();
                messages = messages
                    .filter((m) => (m.content ?? '').length > 0 || (m.embeds?.length ?? 0) > 0 || (m.files ?? []).length > 0)
                    .reverse();
                messages = messages.slice(messages.length - (options?.maxMessagesPerChannel ?? 10));
                for (const msg of messages) {
                    const sentMsg = await webhook
                        .send({
                            content: msg.content?.length ? msg.content : undefined,
                            username: msg.username,
                            avatarURL: msg.avatar,
                            embeds: msg.embeds,
                            files: msg.files?.map((f) => new AttachmentBuilder(f.attachment, {
                                name: f.name
                            })),
                            allowedMentions: options?.allowedMentions,
                            threadId: channel.isThread() ? channel.id : undefined
                        })
                        .catch((err) => {
                          
                        });
                    if (msg.pinned && sentMsg) await (sentMsg as Message).pin();
                }
                resolve(webhook);
            });
        }

        const createOptions: GuildChannelCreateOptions = {
            name: channelData.name,
            type: undefined,
            parent: category
        };
        if (channelData.type === ChannelType.GuildText || channelData.type === ChannelType.GuildNews) {
            createOptions.topic = (channelData as TextChannelData).topic;
            createOptions.nsfw = (channelData as TextChannelData).nsfw;
            createOptions.rateLimitPerUser = (channelData as TextChannelData).rateLimitPerUser;
            createOptions.type =
                (channelData as TextChannelData).isNews && guild.features.includes(GuildFeature.News) ? ChannelType.GuildNews : ChannelType.GuildText;
        } else if (channelData.type === ChannelType.GuildVoice) {
            // Downgrade bitrate
            let bitrate = (channelData as VoiceChannelData).bitrate;
            const bitrates = Object.values(MaxBitratePerTier);
            while (bitrate > MaxBitratePerTier[guild.premiumTier]) {
                bitrate = bitrates[guild.premiumTier];
            }
            createOptions.bitrate = bitrate;
            createOptions.userLimit = (channelData as VoiceChannelData).userLimit;
            createOptions.type = ChannelType.GuildVoice;
        }
        guild.channels.create(createOptions).then(async (channel) => {
            /* Update channel permissions */
            const finalPermissions: OverwriteData[] = [];
            channelData.permissions.forEach((perm) => {
                const role = guild.roles.cache.find((r) => r.name === perm.roleName);
                if (role) {
                    finalPermissions.push({
                        id: role.id,
                        allow: BigInt(perm.allow),
                        deny: BigInt(perm.deny)
                    });
                }
            });
            await channel.permissionOverwrites.set(finalPermissions);
            if (channelData.type === ChannelType.GuildText) {
                /* Load messages */
                let webhook: Webhook | void;
                if ((channelData as TextChannelData).messages.length > 0) {
                    webhook = await loadMessages(channel as TextChannel, (channelData as TextChannelData).messages).catch(() => {
                    });
                }
                /* Load threads */
                if ((channelData as TextChannelData).threads.length > 0) { //&& guild.features.includes('THREADS_ENABLED')) {
                    await Promise.all((channelData as TextChannelData).threads.map(async (threadData) => {
                        let autoArchiveDuration = threadData.autoArchiveDuration;
                        //if (!guild.features.includes('SEVEN_DAY_THREAD_ARCHIVE') && autoArchiveDuration === 10080) autoArchiveDuration = 4320;
                        //if (!guild.features.includes('THREE_DAY_THREAD_ARCHIVE') && autoArchiveDuration === 4320) autoArchiveDuration = 1440;
                        return (channel as TextChannel).threads.create({
                            name: threadData.name,
                            autoArchiveDuration
                        }).then((thread) => {
                            if (!webhook) return;
                            return loadMessages(thread, threadData.messages, webhook);
                        });
                    }));
                }
                return channel;
            } else {
                resolve(channel); // Return the channel
            }
        });
    });
}

/**
 * Delete all roles, all channels, all emojis, etc... of a guild
 */
export async function clearGuild(guild: Guild) {
    guild.roles.cache
        .filter((role) => !role.managed && role.editable && role.id !== guild.id)
        .forEach((role) => {
            role.delete().catch(() => {
            });
        });
    guild.channels.cache.forEach((channel) => {
        channel.delete().catch(() => {
        });
    });
    guild.emojis.cache.forEach((emoji) => {
        emoji.delete().catch(() => {
        });
    });
    const webhooks = await guild.fetchWebhooks();
    webhooks.forEach((webhook) => {
        webhook.delete().catch(() => {
        });
    });
    const bans = await guild.bans.fetch();
    bans.forEach((ban) => {
        guild.members.unban(ban.user).catch(() => {
        });
    });
    guild.setAFKChannel(null);
    guild.setAFKTimeout(60 * 5);
    guild.setIcon(null);
    guild.setBanner(null).catch(() => {
    });
    guild.setSplash(null).catch(() => {
    });
    guild.setDefaultMessageNotifications(GuildDefaultMessageNotifications.OnlyMentions);
    guild.setWidgetSettings({
        enabled: false,
        channel: null
    });
    if (!guild.features.includes(GuildFeature.Community)) {
        guild.setExplicitContentFilter(GuildExplicitContentFilter.Disabled);
        guild.setVerificationLevel(GuildVerificationLevel.None);
    }
    guild.setSystemChannel(null);
    guild.setSystemChannelFlags([GuildSystemChannelFlags.SuppressGuildReminderNotifications, GuildSystemChannelFlags.SuppressJoinNotifications, GuildSystemChannelFlags.SuppressPremiumSubscriptions]);
    return;
}