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

    for (const data of youtubeData) {
        try {
            const videodata = await parser.parseURL(
                `https://www.youtube.com/feeds/videos.xml?channel_id=${data.YoutubeChannelId}`
            );

            if (!videodata) continue;
            if (!videodata.items[0]) continue;

            const guild = guilds.cache.get(`${data.GuildId}`);
            if (!guild) continue;

            const toggleData = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: guild.id
                }
            });

            if (!toggleData) continue;
            if (toggleData.YoutubeEnabled == false) continue;
            const youtubeChannel = channels.cache.get(`${data.ChannelId}`);
            if (!youtubeChannel) new Error("twitchChannel not found");

            const {link, author, title, id} = videodata.items[0];

            const thumbnail = `https://img.youtube.com/vi/${id.split(":")[2]
            }/0.jpg`;

            if (data.Latest && (data.Latest as unknown as string).includes(id))
                continue;
            else {
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
            }

            const pingrole = data.PingRoles[0];

            const messageData = await database.messageTemplates.findFirst({

                where: {
                    Name: data.MessageTemplateId,
                }
            });
            if (!messageData) return

            const channel = guild.channels.cache.get(
                (youtubeChannel as TextChannel)?.id as string
            );
            if (!channel) return

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
            if (!message) return

            if (channel.type == ChannelType.PublicThread) {
                await channel.send(message!.messageData)
            } else {
                await (channel as TextChannel).send(message.messageData)
            }

        } catch (e) {
            return
        }
    }
}
