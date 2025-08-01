import {ExtendedClient} from "../../types/client.js";
import {database} from "../../main/database.js";

export async function banScheduled(client: ExtendedClient) {
    const data = await database.guildBans.findMany()

    for (const d of data) {
        const currentTime = Date.now();
        const banDuration = Number(d.Time);
        const banStartTime = new Date(d.CreatedAt).getTime();
        const banExpirationTime = banStartTime + banDuration;
        const remainingTime = banExpirationTime - currentTime;

        if (remainingTime > 0) {
            continue;
        }

        if (remainingTime <= 0 && d.Banned === true) {
            await handleBanExpiration(client, d);
        }
    }
}

async function handleBanExpiration(client: ExtendedClient, d: any) {
    try {
        const guild = await client.guilds.fetch(d.GuildID as string);
        if (!guild) return;

        for (const user of d.UserID) {
            const member = await client?.users.fetch(user);
            if (!member) continue;

            if (d.Banned === false) continue;

            await database.guildBans.update({
                where: {
                    UUID: d.UUID
                },
                data: {
                    Banned: false
                }
            });

            await guild?.members.unban(
                user,
                `Ban time expired - UUID: ${d.UUID} Ban Reason: ${d.Reason ?? "No reason provided"}`
            );
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}
