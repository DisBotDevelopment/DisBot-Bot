import colors from "colors";
import {ChannelType, TextChannel} from "discord.js";
import Parser from "rss-parser";
import {ExtendedClient} from "../types/ExtendedClient.js";
import {database} from "../main/database.js";
import {MessageBuilder} from "../helper/messageHelper.js";

const parser = new Parser();
colors.enable();

/**
 *
 * @param {Client} client
 */
export async function checkYoutube(client: ExtendedClient) {
    const {guilds, channels} = client;

    const youtubeData = await database.guildYoutubeNotifications.findMany();
    if (!youtubeData) return;

    for (let data of youtubeData) {
        try {
            const toggleData = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: data.GuildId
                }
            });
            if (!toggleData) continue;
            if (toggleData.YoutubeEnabled == false) continue;
            const videoData = await parser.parseURL(
                `https://www.youtube.com/feeds/videos.xml?channel_id=${data.YoutubeChannelId}`
            );
            if (!videoData) continue;
            if (!videoData.items[0]) continue;
            if (data.Latest.includes(videoData.items[0].id)) continue;


            const {link, author, title, id} = videoData.items[0];
            const thumbnail = `https://img.youtube.com/vi/${id.split(":")[2]
            }/0.jpg`;

            const discordYoutubeChannel = await channels.fetch(data.ChannelId);
            if (!discordYoutubeChannel) new Error("twitchChannel not found");

            await database.guildYoutubeNotifications.updateMany({
                where: {
                    GuildId: data.GuildId,
                    YoutubeChannelId: data.YoutubeChannelId
                }, data: {
                    Latest: {
                        push: id
                    }
                }
            })

            const pingrole = data.PingRoles[0];

            const messageData = await database.messageTemplates.findFirst({

                where: {
                    Name: data.MessageTemplateId,
                }
            });
            if (!messageData) continue

            const guild = await guilds.fetch(data.GuildId);
            if (!guild) continue;
            const channel = guild.channels.cache.get(
                (discordYoutubeChannel as TextChannel)?.id as string
            );
            if (!channel) continue

            if (!messageData) continue;
            const placeholder = {
                youtube: {
                    author: author,
                    title: title,
                    link: link,
                    thumbnail: thumbnail,
                    pingRole: `<@&${pingrole}>`,
                }
            }
            const message = await MessageBuilder(
                messageData,
                placeholder
            )
            if (!message) continue

            if (channel.type == ChannelType.PublicThread) {
                await channel.send(message!.messageData)
            } else {
                await (channel as TextChannel).send(message.messageData)
            }
        } catch (e) {
        
        }
    }
}
