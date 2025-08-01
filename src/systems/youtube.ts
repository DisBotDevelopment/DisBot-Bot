import colors from "colors";
import { EmbedBuilder, NewsChannel, TextChannel, ThreadChannel } from "discord.js";
import Parser from "rss-parser";
import { ExtendedClient } from "../types/client.js";
import { database } from "../main/database.js";

const parser = new Parser();
colors.enable();

/**
 *
 * @param {Client} client
 */
export async function checkYoutube(client: ExtendedClient) {
    const { guilds, channels } = client;

    const youtubeData = await database.youtubeNotifications.findMany();

    if (!youtubeData) return;

    for (const data of youtubeData) {
        try {
            let videodata = await parser.parseURL(
                `https://www.youtube.com/feeds/videos.xml?channel_id=${data.YoutubeChannelId}`
            );

            if (!videodata) continue;
            if (!videodata.items[0]) continue;

            let guild = guilds.cache.get(`${data.GuildId}`);
            if (!guild) continue;

            const toggledata = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: guild.id
                }
            });

            if (!toggledata) continue;
            if (toggledata.YoutubeEnabled == false) continue;
            const twitchChannel = channels.cache.get(`${data.ChannelId}`);
            if (!twitchChannel) throw new Error("twitchChannel not found");

            let { link, author, title, id } = videodata.items[0];

            const thumbnail = `https://img.youtube.com/vi/${id.split(":")[2]
                }/0.jpg`;

            if (data.Latest && (data.Latest as unknown as string).includes(id))
                continue;
            else {
                await database.youtubeNotifications.updateMany({
                    where: {
                        GuildId: data.GuildId,
                        YoutubeChannelId: data.YoutubeChannelId
                    }, data: {
                        Latest: {
                            push: id
                        }
                    }
                })
            }

            let pingrole = data.PingRoles[0];

            const messageData = await database.messageTemplates.findFirst({

                where: {
                    Name: data.MessageTemplateId,
                }
            });

            const channel = guild.channels.cache.get(
                (twitchChannel as TextChannel)?.id as string
            );

            if (!messageData) continue;

            if (twitchChannel?.isThread()) {

                const embed = messageData.EmbedJSON?.replace("{author}", author)
                    .replace("{title}", title as string)
                    .replace("{link}", link as string)
                    .replace("{thumbnail}", thumbnail)
                    .replace("https://youtube.com/@yourname", link as string)
                    .replace("https://youtube.com/thumbnail.png", thumbnail)
                    .replace("{pingrole}", `<@&${pingrole}>`);

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
                            ? messageData.Content.replace("{author}", author)
                                .replace("{title}", title as string)
                                .replace("{link}", link as string)
                                .replace("{thumbnail}", thumbnail)
                                .replace("{pingrole}", `<@&${pingrole}>`)
                            : ""
                            }`
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
                            ? messageData.Content.replace("{author}", author)
                                .replace("{title}", title as string)
                                .replace("{link}", link as string)
                                .replace("{thumbnail}", thumbnail)
                                .replace("{pingrole}", `<@&${pingrole}>`)
                            : ""
                            }`
                    });
                }
            } else {
                const embed = messageData?.EmbedJSON?.replace("{author}", author)
                    .replace("{title}", title as string)
                    .replace("{link}", link as string)
                    .replace("{thumbnail}", thumbnail)
                    .replace("https://youtube.com/@yourname", link as string)
                    .replace("https://youtube.com/thumbnail.png", thumbnail)
                    .replace("{pingrole}", `<@&${pingrole}>`);

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
                            ? messageData.Content.replace("{author}", author)
                                .replace("{title}", title as string)
                                .replace("{link}", link as string)
                                .replace("{thumbnail}", thumbnail)
                                .replace("{pingrole}", `<@&${pingrole}>`)
                            : ""
                            }`
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
                            ? (messageData.Content as string).replace("{author}", author)
                                .replace("{title}", title as string)
                                .replace("{link}", link as string)
                                .replace("{thumbnail}", thumbnail)
                                .replace("{pingrole}", `<@&${pingrole}>`)
                            : ""
                            }`
                    });
                }

            }
        } catch (e) {
            continue;
        }
    }
}
