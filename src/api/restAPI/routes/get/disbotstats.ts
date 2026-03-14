import type {Request, Response} from "express";
import {ExtendedClient} from "../../../../types/ExtendedClient.js";

export const disbotstatsRoute = async (
    req: Request,
    res: Response
): Promise<void> => {
    const client = req.app.get("client") as ExtendedClient;
    const guildData = await client.shard?.broadcastEval((shardClient) => {
        const extendedClient = shardClient as ExtendedClient;
        return extendedClient.guilds.cache.map((guild) => ({
            id: guild.id,
            name: guild.name,
            memberCount: guild.memberCount,
            icon: guild.iconURL(),
        }));
    });

    const topGuilds = guildData
        ?.flat()
        .filter((guild: any) => guild.icon)
        .filter((guild: any) => guild.name.toLowerCase().includes("OnlyFans") === false ||
            guild.name.toLowerCase().includes("Only") === false ||
            guild.name.toLowerCase().includes("Leaks") === false ||
            guild.name.toLowerCase().includes("Leak") === false ||
            guild.name.toLowerCase().includes("Porn") === false ||
            guild.name.toLowerCase().includes("Pornhub") === false)
        .sort((a: any, b: any) => b.memberCount - a.memberCount)
        // Set the count of guilds
        .slice(0, 16);

    const guildCounts = await client.guilds.fetch()

    const botUptime = client.uptime;

    const botStartTimestamp = Date.now() - (botUptime ?? 0);

    const timestamp = Math.floor(botStartTimestamp / 1000);

    const data = {
        uptime: timestamp,
        ping: client.ws.ping,
    };

    res.json({
        stats: data,
        tenguilds: topGuilds,
        guildcound: guildCounts.size,
        commands: (client as ExtendedClient).commands?.map((command) => ({
            name: command.command?.name,
            description: command.command?.description,
            options: command.command?.options || []
        })),
    });
};

export default disbotstatsRoute;
