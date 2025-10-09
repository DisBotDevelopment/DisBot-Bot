import {ActivityType, PresenceUpdateStatus} from "discord.js";
import {ExtendedClient} from "../types/client.js";

export async function versionData(client?: ExtendedClient) {


    const fetchTags = await fetch("https://api.github.com/repos/DisBotDevelopment/DisBot-Bot/tags", {
        method: "GET"
    })
    const data = (await fetchTags.json())[0]

    if (client) {
        client.user.presence.set({
            status: PresenceUpdateStatus.Online,
            activities: [
                {
                    type: ActivityType.Custom,
                    name: `disbot.app | 🧪 ${data.name}`,
                },
            ],
        })
    }

    return {
        version: data.name,
    }
}
