import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ContainerBuilder,
    MessageFlags, SeparatorBuilder, SeparatorSpacingSize,
    TextDisplayBuilder,
    WebhookClient
} from "discord.js";
import {database} from "../main/database.js";
import {ExtendedClient} from "../types/ExtendedClient.js";
import {randomUUID} from "crypto";

export async function loggingHelper(
    client: ExtendedClient,
    message: string,
    webhookClient: WebhookClient,
    eventJSON: string,
    eventName: string,
) {

   

    const uuid = randomUUID()

    const webhookMessage = await webhookClient.send(
        {
            allowedMentions: {
                roles: [],
                users: []
            },
            withComponents: true,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(message))
                    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("More Actions")
                                .setEmoji("<:list:1404137033496002591>")
                                .setCustomId("logging-actions:" + uuid + ":" + eventName)
                        )
                    )
            ],
            flags: MessageFlags.IsComponentsV2
        })

    try {
        const webhookData = await client.fetchWebhook(webhookMessage.webhook_id ?? "")
        await database.guildLogs.create({
            data: {
                GuildId: webhookData.guildId,
                UUID: uuid,
                Notes: [],
                LogMessage: message,
                LogJSON: JSON.stringify(eventJSON)
            }
        })
    } catch (e) {
        return
    }


}