import axios from "axios";
import {EmbedBuilder} from "discord.js";
import {ExtendedClient} from "../types/client.js";
import {database} from "../main/database.js";
import {Config} from "../main/config.js";

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

    const spotify = await database.spotifyNotifications.findMany()
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
        if (toggle.SpotifyEnabled == null) continue;

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

        const message = await database.messageTemplates.findFirst({
            where: {
                Name: s.MessageTemplateId,
            }
        });

        if (!message) continue;

        const content = message.Content?.replace("{title}", episode.name).replace("{description}", episode.description).replace("{spotify.episode.url}", episode.external_urls.spotify).replace("{spotify.episode.image}", episode.images[0].url).replace("{author}", apiShow.data.name).replace("{spotify.show.url}", apiShow.data.external_urls.spotify).replace("{spotify.author.image}", apiShow.data.images[0].url).replace("{publisher}", apiShow.data.publisher).replace("{episodeid}", episode.id).replace("{showid}", data.id).replace("{total_episodes}", apiShow.data.total_episodes).replace("{spotify.episode.description}", episode.description)

        const channel = client.channels.cache.get(s.ChannelId as string);
        if (!channel) continue;
        if (!channel.isSendable()) continue;
        if (message.EmbedJSON) {
            channel.send({
                content: content,
                embeds: [new EmbedBuilder(JSON.parse(message.EmbedJSON.replace("{spotify.episode.url}", episode.external_urls.spotify).replace("{title}", episode.name).replace("{description}", episode.description).replace("https://open.spotify.com/episode/episodeid", episode.external_urls.spotify).replace("https://a.nocw.site/u/85qdoB.png", episode.images[0].url).replace("{author}", apiShow.data.name).replace("https://open.spotify.com/show/showid", apiShow.data.external_urls.spotify).replace("{spotify.show.url}", apiShow.data.external_urls.spotify).replace("https://a.nocw.site/u/XOQXYJ.png", apiShow.data.images[0].url).replace("{publisher}", apiShow.data.publisher).replace("{episodeid}", episode.id).replace("{showid}", data.id).replace("{total_episodes}", apiShow.data.total_episodes).replace("{spotify.episode.description}", episode.description)
                ))],
            })
        } else {
            channel.send({
                content: content,
            })
        }

        await database.spotifyNotifications.update({
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