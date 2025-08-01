import {ChannelType, TextChannel} from "discord.js";
import express, {Request, Response} from "express";
import path from "path";
import {ExtendedClient} from "../../types/client.js";
import {Logger} from "../../main/logger.js";
import {LoggingAction} from "../../enums/loggingTypes.js";
import {Config} from "../../main/config.js";
import {database} from "../../main/database.js";


export async function vanityAPI(client: ExtendedClient) {
    const app = express();

    app.set("view engine", "ejs");
    app.use(express.static(`${process.cwd()}/src/api/public`));

    app.get("/:slug", async (req: Request, res: Response) => {
        const slug = req.params.slug;
        const data = await database.vanitys.findFirst({
            include: {
                Analytics: true,
                Embed: {
                    include: {
                        Author: true
                    }
                }
            },
            where: {
                Slug: slug
            }
        });

        if (!data) {
            return res.status(200).sendFile(path.join(process.cwd(), "src", "api", "public", "html", "404.html"));
        }

        const userIP = req.socket.remoteAddress;

        const isUniqueClick = !data.Analytics?.LoggedIPs?.includes(userIP as string);
        if (isUniqueClick) {
            await database.vanityAnalytics.update({
                where: {
                    VanityId: data.UUID
                },
                data: {
                    UniqueClick: +1,
                    LoggedIPs: {
                        push: userIP
                    }
                }
            });
            await database.analyticsLatest30Days.update({
                where: {
                    VanityAnalyticsId: data.UUID
                },
                data: {
                    UniqueClick: +1,
                }
            });
        }

        await database.vanityAnalytics.update({
            where: {
                VanityId: data.UUID
            },
            data: {
                Click: +1,
                Update: new Date()
            }
        });
        await database.analyticsLatest30Days.update({
            where: {
                VanityAnalyticsId: data.UUID
            },
            data: {
                Click: +1,
                Date: new Date()
            }
        });

        const guild = client.guilds.cache.get(data.GuildId as string);
        let inviteURL = data.Invite;

        try {
            const invites = await guild?.invites.fetch();
            const found = invites?.find((i) => i.url === inviteURL);

            if (!found) {
                const firstTextChannel = guild?.channels.cache.find((c) => c.type === ChannelType.GuildText) as TextChannel;

                const newInvite = await guild?.invites.create(firstTextChannel, {
                    maxAge: 0,
                    maxUses: 0,
                });

                if (newInvite) {
                    inviteURL = newInvite.url;
                    await database.vanitys.updateMany({
                        where: {Slug: slug}, data: {Invite: inviteURL}
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching or creating invite:", error);
        }

        res.render(path.join(process.cwd(), "src", "api", "public", "html", "embed.ejs"), {
            InviteURL: inviteURL,
            PageTitle: data.Embed?.Title,
            PageDescription: data.Embed?.Description,
            Color: data.Embed?.Color || "#88f",
            AuthorName: data.Embed?.Author?.Name,
            AuthorURL: data.Embed?.Author?.URL,
            AuthorIconURL: data.Embed?.Author?.IconURL,
            ThumbnailURL: data.Embed?.ThumbnailUrl,
            ImageURL: data.Embed?.ImageUrl
        });
    });

    app.get("/", (req, res) => {
        return res
            .status(200)
            .render(path.join(process.cwd(), "src", "api", "public", "html", "dchat.ejs"))
    });

    app.listen(Config.Other.VanityPort, () => {
        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "VanityAPI",
            message: `Vanity API is running on port ${Config.Other.VanityPort}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });

    })
}
