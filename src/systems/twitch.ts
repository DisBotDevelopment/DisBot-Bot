import { ExtendedClient } from "../types/client.js";
import axios from "axios";
import { EmbedBuilder, Guild, NewsChannel, TextChannel, ThreadChannel, } from "discord.js";
import { database } from "../main/database.js";

/**
 *
 * @param {ExtendedClient} client
 */
export async function checkTwitch(client: ExtendedClient) {

    const config = await database.disBot.findFirst({ where: { GetConf: "config" } });
    const twitchdata = await database.twitchNotifications.findMany()

    if (!twitchdata) return;

    for (const twitchDocument of twitchdata) {

        try {

            const isChannel = await axios.get(`https://api.twitch.tv/helix/users?login=${twitchDocument.TwitchChannelName}`, {
                headers: {
                    "Client-Id": "dtqw2suy9vbzzhpoure8ibuq8r0vnj",
                    Authorization: `Bearer ${config?.TwitchToken}`,
                    "Content-Type": "application/json",
                },
            });

            const channelData = isChannel.data?.data;

            if (!channelData || channelData.length == 0) {
                await database.twitchNotifications.deleteMany({
                    where: {
                        id: twitchDocument.id,
                    }
                })
                continue;
            }

            const response = await axios.get(
                `https://api.twitch.tv/helix/streams?user_login=${twitchDocument.TwitchChannelName}`,
                {
                    headers: {
                        "Client-Id": "dtqw2suy9vbzzhpoure8ibuq8r0vnj",
                        Authorization: `Bearer ${config?.TwitchToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const stream = response.data.data[0];

            if (!stream) {
                await database.twitchNotifications.updateMany(
                    {
                        where: {
                            TwitchChannelName: twitchDocument.TwitchChannelName,
                            GuildId: twitchDocument.GuildId,
                        },
                        data: { Live: false }
                    }
                );

                continue;
            }

            if (twitchDocument.Live == true) {
                continue;
            }

            if (stream) {
                if (twitchDocument.Live == false && stream.type == "live") {
                    const messageData = await database.messageTemplates.findFirst({
                        where: {
                            Name: twitchDocument.MessageTemplateId,
                        }
                    });

                    if (!messageData) continue;

                    const guild = client.guilds.cache.get(`${twitchDocument.GuildId}`);
                    if (!guild) continue;
                    const channeltype = guild.channels.cache.get(
                        `${twitchDocument.ChannelId}`
                    );
                    const channel = guild.channels.cache.get(
                        channeltype?.id as string
                    );

                    const toggledata = await database.guildFeatureToggles.findFirst({
                        where: {
                            GuildId: guild.id
                        }
                    });

                    if (!toggledata) continue;
                    if (toggledata.TwitchEnabled == false) continue;

                    const streamUrl = `https://www.twitch.tv/${twitchDocument.TwitchChannelName}`;
                    const thumbnailUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchDocument.TwitchChannelName}-1920x1080.jpg`;

                    await database.twitchNotifications.updateMany(
                        {
                            where: {
                                TwitchChannelName: twitchDocument.TwitchChannelName,
                                GuildId: twitchDocument.GuildId,
                            },
                            data: { Live: true }
                        }
                    );

                    if (channeltype?.isThread()) {


                        const embed = messageData?.EmbedJSON?.replace(
                            "https://twitch.tv/streamurl",
                            `${streamUrl}`
                        )
                            .replace("{stream.url}", `${streamUrl}`)
                            .replace("{streamer}", `${stream.user_name}`)
                            .replace("{pingrole}", `<@&${twitchDocument.PingRoles[0]}>`)
                            .replace("{stream.viewer_count}", `${stream.viewer_count}`)
                            .replace("{stream.game_name}", `${stream.game_name}`)
                            .replace("{stream.vod}", `${thumbnailUrl}`)
                            .replace(
                                "https://static-cdn.jtvnw.net/previews-ttv/live_user_streamer-1920x1080.jpg",
                                `${thumbnailUrl}`
                            )
                            .replace("{stream.title}", `${stream.title}`)
                            .replace("{stream.user_name}", `${stream.user_name}`);

                        if (!messageData.EmbedJSON) {
                            if (
                                !(channel instanceof TextChannel ||
                                    channel instanceof NewsChannel ||
                                    channel instanceof ThreadChannel)
                            ) {
                                continue;
                            }
                            channel?.send({
                                content: `${messageData.Content
                                    ? messageData.Content.replace(
                                        "{stream.url}",
                                        `${streamUrl}`
                                    )
                                        .replace("{streamer}", `${stream.user_name}`)
                                        .replace(
                                            "{pingrole}",
                                            `<@&${twitchDocument.PingRoles[0]}>`
                                        )
                                        .replace(
                                            "{stream.viewer_count}",
                                            `${stream.viewer_count}`
                                        )
                                        .replace(
                                            "{stream.game_name}",
                                            `${stream.game_name}`
                                        )
                                        .replace("{stream.vod}", `${thumbnailUrl}`)
                                        .replace("{stream.title}", `${stream.title}`)
                                        .replace(
                                            "{stream.user_name}",
                                            `${stream.user_name}`
                                        )
                                    : ""
                                    }`,
                            });

                            continue;
                        } else {
                            if (
                                !(channel instanceof TextChannel ||
                                    channel instanceof NewsChannel ||
                                    channel instanceof ThreadChannel)
                            ) {
                                continue;
                            }
                            channel?.send({
                                embeds: [new EmbedBuilder(JSON.parse(embed as string))],
                                content: `${messageData.Content
                                    ? messageData.Content.replace(
                                        "{stream.url}",
                                        `${streamUrl}`
                                    )
                                        .replace("{streamer}", `${stream.user_name}`)
                                        .replace(
                                            "{pingrole}",
                                            `<@&${twitchDocument.PingRoles[0]}>`
                                        )
                                        .replace(
                                            "{stream.viewer_count}",
                                            `${stream.viewer_count}`
                                        )
                                        .replace(
                                            "{stream.game_name}",
                                            `${stream.game_name}`
                                        )
                                        .replace("{stream.vod}", `${thumbnailUrl}`)
                                        .replace("{stream.title}", `${stream.title}`)
                                        .replace(
                                            "{stream.user_name}",
                                            `${stream.user_name}`
                                        )
                                    : ""
                                    }`,
                            });
                        }
                    } else {
                        const embed = messageData?.EmbedJSON?.replace(
                            "https://twitch.tv/streamurl",
                            `${streamUrl}`
                        )
                            .replace("{stream.url}", `${streamUrl}`)
                            .replace("{streamer}", `${stream.user_name}`)
                            .replace("{pingrole}", `<@&${twitchDocument.PingRoles[0]}>`)
                            .replace("{stream.viewer_count}", `${stream.viewer_count}`)
                            .replace("{stream.game_name}", `${stream.game_name}`)
                            .replace("{stream.vod}", `${thumbnailUrl}`)
                            .replace(
                                "https://static-cdn.jtvnw.net/previews-ttv/live_user_streamer-1920x1080.jpg",
                                `${thumbnailUrl}`
                            )
                            .replace("{stream.title}", `${stream.title}`)
                            .replace("{stream.user_name}", `${stream.user_name}`);


                        if (!messageData.EmbedJSON) {
                            if (
                                !(channel instanceof TextChannel ||
                                    channel instanceof NewsChannel ||
                                    channel instanceof ThreadChannel)
                            ) {
                                continue;
                            }
                            channel.send({
                                content: `${messageData.Content
                                    ? messageData.Content.replace(
                                        "{stream.url}",
                                        `${streamUrl}`
                                    )
                                        .replace("{streamer}", `${stream.user_name}`)
                                        .replace(
                                            "{pingrole}",
                                            `<@&${twitchDocument.PingRoles[0]}>`
                                        )
                                        .replace(
                                            "{stream.viewer_count}",
                                            `${stream.viewer_count}`
                                        )
                                        .replace(
                                            "{stream.game_name}",
                                            `${stream.game_name}`
                                        )
                                        .replace("{stream.vod}", `${thumbnailUrl}`)
                                        .replace("{stream.title}", `${stream.title}`)
                                        .replace(
                                            "{stream.user_name}",
                                            `${stream.user_name}`
                                        )
                                    : ""
                                    }`,
                            });

                            continue;
                        } else {


                            if (
                                !(channel instanceof TextChannel ||
                                    channel instanceof NewsChannel ||
                                    channel instanceof ThreadChannel)
                            ) {
                                continue;
                            }
                            channel.send({
                                embeds: [new EmbedBuilder(JSON.parse(embed as string))],
                                content: `${messageData.Content
                                    ? messageData.Content.replace(
                                        "{stream.url}",
                                        `${streamUrl}`
                                    )
                                        .replace("{streamer}", `${stream.user_name}`)
                                        .replace(
                                            "{pingrole}",
                                            `<@&${twitchDocument.PingRoles[0]}>`
                                        )
                                        .replace(
                                            "{stream.viewer_count}",
                                            `${stream.viewer_count}`
                                        )
                                        .replace(
                                            "{stream.game_name}",
                                            `${stream.game_name}`
                                        )
                                        .replace("{stream.vod}", `${thumbnailUrl}`)
                                        .replace("{stream.title}", `${stream.title}`)
                                        .replace(
                                            "{stream.user_name}",
                                            `${stream.user_name}`
                                        )
                                    : ""
                                    }`,
                            });
                        }
                    }
                } else {
                    continue;
                }
            }
        } catch (error) {
            console.log(error);

        }
    }
}
