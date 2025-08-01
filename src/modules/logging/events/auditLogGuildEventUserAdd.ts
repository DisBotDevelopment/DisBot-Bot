import {
    Events,
    GuildScheduledEvent,
    User,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildScheduledEventUserAdd,

    async execute(
        guildScheduledEvent: GuildScheduledEvent,
        user: User,
        client: ExtendedClient
    ) {
        const guild = guildScheduledEvent.guild;
        if (!guild) {
            console.error("Guild not found for event:", guildScheduledEvent.id);
            return;
        }

        // Check if logging is enabled
        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled?.LoggingEnabled) return;

        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!loggingData?.Integration) return;

        const webhook = new WebhookClient({url: loggingData.Integration});

        // Format event details
        const eventDetails = [
            `### User Joined Scheduled Event`,
            ``,
            `> **Event**: \`${guildScheduledEvent.name}\` (\`${guildScheduledEvent.id}\`)`,
            `> **User**: ${user} (\`${user.id}\`)`,
            `> **Start Time**: \`${guildScheduledEvent.scheduledStartAt?.toLocaleString() || "Not specified"}\``,
            `> **Location**: ${guildScheduledEvent.channel ? `<#${guildScheduledEvent.channel.id}>` : "None"}`,
            `> **Event Type**: \`${guildScheduledEvent.entityType}\``,
            ``,
            `- **Joined at**: \`${new Date().toLocaleString()}\``
        ];

        await loggingHelper(client,
            eventDetails.join("\n"),
            webhook,
            JSON.stringify({
                event: {
                    id: guildScheduledEvent.id,
                    name: guildScheduledEvent.name,
                    description: guildScheduledEvent.description,
                    entityType: guildScheduledEvent.entityType,
                    status: guildScheduledEvent.status,
                    channelId: guildScheduledEvent.channel?.id,
                    scheduledStartAt: guildScheduledEvent.scheduledStartAt?.toISOString(),
                    scheduledEndAt: guildScheduledEvent.scheduledEndAt?.toISOString(),
                    url: guildScheduledEvent.url
                },
                user: {
                    id: user.id,
                    username: user.username,
                    tag: user.tag,
                    avatarURL: user.displayAvatarURL()
                },
                joinTime: new Date().toISOString()
            }, null, 2),
            "GuildScheduledEventUserAdd"
        );
    }
};