import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    FileBuilder,
    MessageFlags,
    StringSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../types/client.js";
import {database} from "../main/database.js";

export class Scheduler {
    public static async checkLast30DaysVanities(client: ExtendedClient) {
        const vanities = await database.vanitys.findMany({
            include: {
                Analytics: {
                    include: {
                        Latest30Days: true
                    }
                }
            }
        });

        for (const value of vanities) {
            const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

            const needsReset = !value.Analytics?.Latest30Days?.Date ||
                new Date().getTime() - new Date(value.Analytics.Latest30Days.Date).getTime() > THIRTY_DAYS_MS;

            if (needsReset) {
                await database.analyticsLatest30Days.updateMany({
                    where: {
                        VanityAnalyticsId: value.UUID
                    },
                    data: {
                        Click: 0,
                        UniqueClick: 0,
                        Date: new Date(),
                        JoinedWithCode: 0,
                    }
                })
            }
        }
    }

    public static async deleteMessagesFromAutoDelete(client: ExtendedClient) {
        const autoDeletes = await database.autoDeletes.findMany()

        for (const data of autoDeletes) {

            const channel = await client.channels.fetch(data.ChannelId as string).catch(() => null);
            if (!channel || !channel.isTextBased()) continue;

            for (const msgId of channel.messages.cache.keys()) {
                const msg = await channel.messages.fetch(msgId).catch(() => null);
                if (!msg) continue;
                const whitelistedMessages = data.WhitelistedMessages;
                const whitelistedUsers = data.WhitelistedUsers;
                const whitelistedRoles = data.WhitelistedRoles;


                if (
                    whitelistedMessages.includes(msg.id) ||
                    whitelistedUsers.includes(msg.author.id) ||
                    msg.member?.roles.cache.some(role => whitelistedRoles.includes(role.id))
                ) {
                    continue;
                }

                await msg.delete().catch(() => {
                });
            }
        }
    }
}