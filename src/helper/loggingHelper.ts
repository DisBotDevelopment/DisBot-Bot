import {
    ActionRowBuilder,
    AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelSelectMenuBuilder,
    ContainerBuilder,
    FileBuilder,
    MessageFlags, SeparatorBuilder, SeparatorSpacingSize,
    TextDisplayBuilder, UserSelectMenuBuilder,
    WebhookClient
} from "discord.js";
import {database} from "../main/database.js";
import {ExtendedClient} from "../types/client.js";
import {randomUUID} from "crypto";

export async function loggingHelper(
    client: ExtendedClient,
    message: string,
    webhookClient: WebhookClient,
    eventJSON: string,
    eventName: string,
) {

    const fileBuffer = Buffer.from(eventJSON, "utf-8");

    const uuid = randomUUID()

    const webhookMessage = await webhookClient.send(
        {
            withComponents: true,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(message))
                    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("logging-add-note:" + uuid)
                                .setLabel("Add Note")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("logging-delete-note:" + uuid)
                                .setLabel("Delete Note by Id")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("logging-show-note:" + uuid)
                                .setLabel("Show all notes")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent("-# **Send this Log to a User (DM)**"))
                    .addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId("logging-to-user:" + uuid)
                        )
                    )
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent("-# **Send this log to a Channel (In this Guild)**"))
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId("logging-to-channel:" + uuid)
                        )
                    )
                    .addFileComponents(
                        new FileBuilder().setURL(`attachment://${eventName}.json`)
                    )
            ],
            files: [
                new AttachmentBuilder(fileBuffer).setName(`${eventName}.json`),
            ],
            flags: MessageFlags.IsComponentsV2
        })

    const webhookData = await client.fetchWebhook(webhookMessage.webhook_id)


    await database.guildLoggers.create({
        data: {
            GuildId: webhookData.guildId,
            UUID: uuid,
            Notes: [],
            LogMessage: message,
            LogJSON: JSON.stringify(eventJSON)
        }
    })


}