import {AttachmentBuilder, Events, Message, WebhookClient} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    name: Events.MessageUpdate,

    /**
     *
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {ExtendedClient} client
     */
    async execute(
        oldMessage: Message,
        newMessage: Message,
        client: ExtendedClient
    ) {

        const syncedLinks = await database.syncedChannelLinkMessages.findMany({
            where: {
                UserMessageId: oldMessage.id
            }
        });

        if (!syncedLinks) return;

        for (const data of syncedLinks) {

            const linkData = await database.guildChannelLinks.findFirst({
                where: {
                    UUID: data.ChannelLinkId
                }
            })

            let messageData = {
                Content: newMessage.content ?? null,
                Embeds: newMessage.embeds ?? null,
                Components: newMessage.components ?? null,
                Attachments: newMessage.attachments.size >= 1 ? await Promise.all(newMessage.attachments.map(async (a) => {
                    const file = await fetch(a.url, {
                        method: "GET",
                        headers: {
                            "Accept": "application/octet-stream",
                        }
                    })
                    const buffer = Buffer.from(await file.arrayBuffer())
                    return {
                        name: a.name,
                        buffer: buffer
                    }
                })) : null
            }

            if (linkData.SyncFlags.length >= 1) {
                if (linkData.SyncFlags.includes("no_bots")) {
                    if (newMessage.author.bot) return
                }
                if (linkData.SyncFlags.includes("no_webhooks")) {
                    if (newMessage.webhookId) return
                }
                if (linkData.SyncFlags.includes("no_webhooks")) {
                    if (newMessage.webhookId) return

                    if (linkData.SyncFlags.includes("no_attachments")) {
                        messageData = {
                            Content: messageData.Content,
                            Embeds: messageData.Embeds,
                            Components: messageData.Components,
                            Attachments: null,
                        }
                    }

                    if (linkData.SyncFlags.includes("no_embeds")) {
                        messageData = {
                            Content: messageData.Content,
                            Embeds: null,
                            Components: messageData.Components,
                            Attachments: messageData.Attachments,
                        }
                    }

                    if (linkData.SyncFlags.includes("no_components")) {
                        messageData = {
                            Content: messageData.Content,
                            Embeds: messageData.Embeds,
                            Components: null,
                            Attachments: messageData.Attachments,
                        }
                    }

                    if (linkData.SyncFlags.includes("send_all")) {
                        messageData = {
                            Content: messageData.Content,
                            Embeds: messageData.Embeds,
                            Components: messageData.Components,
                            Attachments: messageData.Attachments,
                        }
                    }
                }


                const webhook = new WebhookClient({
                    url: data.WebhookUrl as string
                });

                if (!webhook) continue;

                await webhook.editMessage(
                    data.WebhookMessageId,
                    {
                        content: messageData.Content ?? null,
                        embeds: messageData.Embeds ? messageData.Embeds : null,
                        files: messageData?.Attachments?.map((a) =>
                            new AttachmentBuilder(a.buffer).setName(a.name)
                        ) ?? null,
                        components: messageData.Components ? messageData.Components : null,

                        withComponents: true,
                    }
                )
            }
        }
    }
}
