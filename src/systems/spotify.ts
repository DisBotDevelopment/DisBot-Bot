import axios from "axios";
import {EmbedBuilder} from "discord.js";
import {ExtendedClient} from "../types/ExtendedClient.js";
import {database} from "../main/database.js";
import {Config} from "../main/config.js";
import {MessageBuilder} from "../helper/messageHelper.js";

export async function spotify(client: ExtendedClient) {

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                btoa(
                    Config.Modules.Notifications.SpotifyClientId + ":" + Config.Modules.Notifications.SpotifyClientSecret
                ),
        },
        body: "grant_type=client_credentials",
    });
    const authData = await result.json() as { access_token: string };

    await database.disBot.update(
        {
            where: {
                GetConf: "config"
            },
            data: {
                SpotifyToken: authData.access_token,
            }
        },
    );

    const spotify = await database.guildSpotifyNotifications.findMany()
    const conf = await database.disBot.findFirst({
        where: {
            GetConf: "config"
        }
    });

    if (!conf) return;
    if (!spotify) return;
    if (spotify.length === 0) return;

    for (const s of spotify) {
        const toggle = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: s.GuildId
            }
        });
        if (!toggle) continue;
        if (toggle.SpotifyEnabled == false) continue;
        if (toggle.SpotifyEnabled == undefined) continue;

        const apiShow = await axios.get(`https://api.spotify.com/v1/shows/${s.ShowId}`, {
            headers: {
                Authorization: `Bearer ${conf.SpotifyToken}`,
            },
        }).catch((err) => {
            console.log(err);
        });

        if (!apiShow) continue;
        if (apiShow.status != 200) continue;

        const data = apiShow.data;
        const episodes = data.episodes.items;
        const episode = episodes[0];

        if (s.Latests?.includes(episode.id)) continue;

        const messageData = await database.messageTemplates.findFirst({
            where: {
                Name: s.MessageTemplateId,
            }
        });

        if (!messageData) continue;

        const channel = client.channels.cache.get(s.ChannelId as string);
        if (!channel) continue;
        if (!channel.isSendable()) continue;

        const placeholder = {
            spotify: {
                show: {
                    url: apiShow.data.external_urls.spotify,
                    id: data.id
                },
                episode: {
                    url: episode.external_urls.spotify,
                    image: episode.images[0].url,
                    id: episode.id,
                    total: apiShow.data.total_episodes
                },
                title: episode.name,
                description: episode.description,
                author: apiShow.data.name,
                publisher: apiShow.data.publisher,
            }
        }

        const message = await MessageBuilder(
            messageData,
            placeholder
        )

        await channel.send(message.messageData)
        await database.guildSpotifyNotifications.update({
            where: {
                UUID: s.UUID
            },
            data: {
                Latests: {
                    push: episode.id
                }
            }
        })
    }
}