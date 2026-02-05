import {database} from "../../main/database.js";
import ms from "ms";
import {ExtendedClient} from "../../types/ExtendedClient.js";

export async function banScheduled(client: ExtendedClient) {
    /* 
    const data = await database.guildUserModeration.findMany()

    // SOON BACK!

    return
    for (const d of data) {

        const currentTime = Date.now();
        const banDuration = ms(d.Duration as ms.StringValue);
        const banStartTime = new Date(d.CreatedAt).getTime();
        const banExpirationTime = banStartTime + banDuration;
        const remainingTime = banExpirationTime - currentTime;

        if (remainingTime > 0) {
            continue;
        }

        if (remainingTime <= 0 && d.Type == "BAN") {
            await handleBanExpiration(client, d);
        }
    }
     */
}

async function handleBanExpiration(client: ExtendedClient, d: any) {
    try {
        const guild = await client.guilds.fetch(d.GuildID as string);
        if (!guild) return;

        for (const user of d.UserID) {
            const member = await client?.users.fetch(user);
            if (!member) continue;

            if (d.Type == "DONE") continue;

            await database.guildUserModeration.update({
                where: {
                    UUID: d.UUID
                },
                data: {
                    Type: "DONE"
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
