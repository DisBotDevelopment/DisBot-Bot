import {ExtendedClient} from "../types/ExtendedClient.js";
import axios from "axios";
import {ChannelType, TextChannel} from "discord.js";
import {database} from "../main/database.js";
import {Config} from "../main/config.js";
import {MessageBuilder} from "../helper/messageHelper.js";

/**
 *
 * @param {ExtendedClient} client
 */
export async function checkTwitch(client: ExtendedClient) {
    const config = await database.disBot.findFirst({where: {GetConf: "config"}});
    const twitchData = await database.guildTwitchNotifications.findMany()
    if (!twitchData) return;

    for (const twitchDocument of twitchData) {
        try {
            const isChannel = await axios.get(`https://api.twitch.tv/helix/users?login=${twitchDocument.TwitchChannelName}`, {
                headers: {
                    "Client-Id": Config.Modules.Notifications.TwitchClientId,
                    Authorization: `Bearer ${config?.TwitchToken}`,
                    "Content-Type": "application/json",
                },
            });

            const channelData = isChannel.data?.data;

            if (!channelData || channelData.length == 0) {
                await database.guildTwitchNotifications.deleteMany({
                    where: {
                        Id: twitchDocument.Id,
                    }
                })
                continue;
            }

            const response = await axios.get(
                `https://api.twitch.tv/helix/streams?user_login=${twitchDocument.TwitchChannelName}`,
                {
                    headers: {
                        "Client-Id": Config.Modules.Notifications.TwitchClientId,
                        Authorization: `Bearer ${config?.TwitchToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const stream = response.data.data[0];

            if (!stream) {
                await database.guildTwitchNotifications.updateMany(
                    {
                        where: {
                            TwitchChannelName: twitchDocument.TwitchChannelName,
                            GuildId: twitchDocument.GuildId,
                        },
                        data: {Live: false}
                    }
                );

                continue;
            }

            if (twitchDocument.Live == true) {
                continue;
            }


            if (stream && twitchDocument.Live == false && stream.type == "live") {
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
                if (!channel) return

                const toggledata = await database.guildFeatureToggles.findFirst({
                    where: {
                        GuildId: guild.id
                    }
                });

                if (!toggledata) continue;
                if (toggledata.TwitchEnabled == false) continue;

                const streamUrl = `https://www.twitch.tv/${twitchDocument.TwitchChannelName}`;
                const thumbnailUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchDocument.TwitchChannelName}-1920x1080.jpg`;

                await database.guildTwitchNotifications.updateMany(
                    {
                        where: {
                            TwitchChannelName: twitchDocument.TwitchChannelName,
                            GuildId: twitchDocument.GuildId,
                        },
                        data: {Live: true}
                    }
                );

                const placeholder = {
                    twitch: {
                        url: streamUrl,
                        vod: thumbnailUrl,
                        name: stream.user_name,
                        pingRole: `<@&${twitchDocument.PingRoles[0]}>`,
                        viewerCount: stream.viewer_count,
                        gameName: stream.game_name,
                        title: stream.title,
                    }
                }
                const message = await MessageBuilder(
                    messageData!,
                    placeholder
                )

                if (channel.type == ChannelType.PublicThread) {
                    await channel.send(message!.messageData)
                } else {
                    await (channel as TextChannel).send(message!.messageData)
                }

            } else return
        } catch (error) {
            console.log(error);

        }
    }
}
