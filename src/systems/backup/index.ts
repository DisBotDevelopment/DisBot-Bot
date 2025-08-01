import * as createMaster from "./create.js";
import * as loadMaster from "./load.js";
import { BackupData } from "./types/BackupData.js";
import { BackupInfos } from "./types/BackupInfos.js";
import { CreateOptions } from "./types/CreateOptions.js";
import { LoadOptions } from "./types/LoadOptions.js";
import * as utilMaster from "./util.js";
import type { Guild } from 'discord.js';
import { IntentsBitField, SnowflakeUtil } from 'discord.js';
import nodeFetch from 'node-fetch';
import { database } from "../../main/database.js";
import { log } from "console";

/**
 * Checks if a backup exists and returns its data
 */
const getBackupData = async (backupID: string) => {
    return new Promise<BackupData>(async (resolve, reject) => {
        const backupData = await database.guildBackups.findFirst({
            where: {
                UUID: backupID
            }
        });

        if (!backupData) {
            return reject('No backup found');
        }

        const backupJson = JSON.parse(backupData.BackupJSON as string) as BackupData;
        return resolve(backupJson);
    });
};

/**
 * Fetches a backyp and returns the information about it
 */
export const fetch = (backupID: string) => {
    return new Promise<BackupInfos>(async (resolve, reject) => {
        getBackupData(backupID)
            .then(async (backupData) => {
                if (!backupData) {
                    return reject('No backup found');
                }
                const backupInfos: BackupInfos = {
                    id: backupData.id,
                    data: backupData,
                    size: 0
                };

                // Returns backup informations
                resolve(backupInfos);
            })
            .catch(() => {
                reject('No backup found');
            });
    });
};

/**
 * Creates a new backup and saves it to the storage
 */
export const create = async (
    guild: Guild,
    options: CreateOptions = {
        backupName: undefined,
        backupID: undefined,
        maxMessagesPerChannel: 10,
        jsonSave: true,
        jsonBeautify: true,
        doNotBackup: [],
        backupMembers: false,
        saveImages: ''
    }
) => {
    return new Promise<BackupData>(async (resolve, reject) => {

        const intents = new IntentsBitField(guild.client.options.intents);
        if (!intents.has(IntentsBitField.Flags.Guilds)) return reject('Guilds intent is required');

        try {
            const backupData: BackupData = {
                name: guild.name,
                verificationLevel: guild.verificationLevel,
                explicitContentFilter: guild.explicitContentFilter,
                defaultMessageNotifications: guild.defaultMessageNotifications,
                afk: guild.afkChannel ? { name: guild.afkChannel.name, timeout: guild.afkTimeout } : undefined,
                widget: {
                    enabled: guild.widgetEnabled ?? false,
                    channel: guild.widgetChannel ? guild.widgetChannel.name : undefined
                },
                channels: { categories: [], others: [] },
                roles: [],
                bans: [],
                emojis: [],
                members: [],
                createdTimestamp: Date.now(),
                guildID: guild.id,
                id: options.backupID ?? SnowflakeUtil.generate().toString()
            };
            if (guild.iconURL()) {
                if (options && options.saveImages && options.saveImages === 'base64') {
                    backupData.iconBase64 = (
                        await nodeFetch(guild.iconURL()!).then((res) => res.buffer())
                    ).toString('base64');
                }
                backupData.iconURL = guild.iconURL() ?? undefined;
            }
            if (guild.splashURL()) {
                if (options && options.saveImages && options.saveImages === 'base64') {
                    backupData.splashBase64 = (await nodeFetch(guild.splashURL()!).then((res) => res.buffer())).toString(
                        'base64'
                    );
                }
                backupData.splashURL = guild.splashURL() ?? undefined;
            }
            if (guild.bannerURL()) {
                if (options && options.saveImages && options.saveImages === 'base64') {
                    backupData.bannerBase64 = (await nodeFetch(guild.bannerURL()!).then((res) => res.buffer())).toString(
                        'base64'
                    );
                }
                backupData.bannerURL = guild.bannerURL() ?? undefined;
            }
            if (options && options.backupMembers) {
                // Backup members
                backupData.members = await createMaster.getMembers(guild);
            }
            if (!options || !(options.doNotBackup || []).includes('bans')) {
                // Backup bans
                backupData.bans = await createMaster.getBans(guild);
            }
            if (!options || !(options.doNotBackup || []).includes('roles')) {
                // Backup roles
                backupData.roles = await createMaster.getRoles(guild);
            }
            if (!options || !(options.doNotBackup || []).includes('emojis')) {
                // Backup emojis
                backupData.emojis = await createMaster.getEmojis(guild, options);
            }
            if (!options || !(options.doNotBackup || []).includes('channels')) {
                // Backup channels
                backupData.channels = await createMaster.getChannels(guild, options);
            }
            if (!options || options.jsonSave === undefined || options.jsonSave) {
                // Convert Object to JSON
                const backupJSON = options.jsonBeautify
                    ? JSON.stringify(backupData, null, 4)
                    : JSON.stringify(backupData);
                // Save the backup
                await database.guildBackups.create({
                    data: {
                        BackupJSON: backupJSON,
                        CreatedAt: new Date(),
                        UUID: backupData.id,
                        Name: options.backupName,
                        GuildId: backupData.guildID,
                        UserId: guild.ownerId
                    }
                });
            }
            // Returns ID
            resolve(backupData);
        } catch (e) {
            return reject(e);
        }
    });
};

/**
 * Loads a backup for a guild
 */
export const load = async (
    backup: string,
    guild: Guild,
    options: LoadOptions = {
        clearGuildBeforeRestore: true,
        maxMessagesPerChannel: 999999
    }
) => {
    return new Promise(async (resolve, reject) => {
        if (!guild) {
            return reject('Invalid guild');
        }
        try {
            const backupData: BackupData = await getBackupData(backup)
            try {
                if (options.clearGuildBeforeRestore === undefined || options.clearGuildBeforeRestore) {
                    // Clear the guild
                    await utilMaster.clearGuild(guild);
                }
                await Promise.all([
                    // Restore guild configuration
                    loadMaster.loadConfig(guild, backupData),
                    // Restore guild roles
                    loadMaster.loadRoles(guild, backupData),
                    // Restore guild channels
                    loadMaster.loadChannels(guild, backupData, options),
                    // Restore afk channel and timeout
                    loadMaster.loadAFK(guild, backupData),
                    // Restore guild emojis
                    loadMaster.loadEmojis(guild, backupData),
                    // Restore guild bans
                    loadMaster.loadBans(guild, backupData),
                    // Restore embed channel
                    loadMaster.loadEmbedChannel(guild, backupData)
                ]);
            } catch (e) {
                return reject(e);
            }
            // Then return the backup data
            return resolve(backupData);
        } catch (e) {
            return reject('No backup found');
        }
    });
};

/**
 * Removes a backup
 */
export const remove = async (backupID: string) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            await database.guildBackups.deleteMany({
                where: {
                    UUID: backupID
                }
            });
            resolve();
        } catch (error) {
            reject('Backup not found');
        }
    });
};

/**
 * Returns the list of all backup
 */
export const list = async () => {
    await database.guildBackups.findMany({}).then((backups) => {
        return backups.map((backup) => {
            return {
                id: backup.UUID,
                name: backup.Name,
                createdAt: backup.CreatedAt,
                guildID: backup.GuildId,
                userID: backup.UserId,
            };

        });
    })
};

export default {
    create,
    fetch,
    list,
    load,
    remove
};