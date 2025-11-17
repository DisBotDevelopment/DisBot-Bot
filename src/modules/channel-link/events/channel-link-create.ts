import {AttachmentBuilder, Events, GuildTextBasedChannel, Message, WebhookClient} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";


export default {
    name: Events.MessageCreate,

    /**
     *
     * @param {Message} message
     * @param {ExtendedClient} client
     */
    async execute(message: Message, client: ExtendedClient) {
        if (message.author.id == client.user.id) return;
        try {

            const isSynced = await database.syncedChannelLinkMessages.findFirst({
                where: {
                    UserMessageId: message.id
                }
            });
            if (isSynced) {
                return
            }

            const data = await database.guildChannelLinks.findFirst({
                where: {
                    GuildId: message.guildId,
                    ChannelId: message.channelId
                }
            })
            if (!data) return

            let messageData = {
                Content: message.content ?? null,
                Embeds: message.embeds ?? null,
                Components: message.components ?? null,
                Attachments: message.attachments.size >= 1 ? await Promise.all(message.attachments.map(async (a) => {
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

            if (data.SyncFlags.length >= 1) {
                if (data.SyncFlags.includes("no_bots")) {
                    if (message.author.bot) return
                }
                if (data.SyncFlags.includes("no_webhooks")) {
                    if (message.webhookId) return
                }
                if (data.SyncFlags.includes("no_webhooks")) {
                    if (message.webhookId) return
                }
                if (data.SyncFlags.includes("no_attachments")) {
                    messageData = {
                        Content: messageData.Content,
                        Embeds: messageData.Embeds,
                        Components: messageData.Components,
                        Attachments: null,
                    }
                }

                if (data.SyncFlags.includes("no_embeds")) {
                    messageData = {
                        Content: messageData.Content,
                        Embeds: null,
                        Components: messageData.Components,
                        Attachments: messageData.Attachments,
                    }
                }

                if (data.SyncFlags.includes("no_components")) {
                    messageData = {
                        Content: messageData.Content,
                        Embeds: messageData.Embeds,
                        Components: null,
                        Attachments: messageData.Attachments,
                    }
                }

                if (data.SyncFlags.includes("send_all")) {
                    messageData = {
                        Content: messageData.Content,
                        Embeds: messageData.Embeds,
                        Components: messageData.Components,
                        Attachments: messageData.Attachments,
                    }
                }
            }


            for (const linkUUID of data.LinkedWith) {
                const linkedData = await database.guildChannelLinks.findFirst({
                    where: {
                        UUID: linkUUID
                    }
                })
                if (!linkedData) continue
                const webhook = new WebhookClient({
                    url: linkedData.WebhookUrl as string
                });

                if (!webhook) continue

                webhook
                    .send({
                        content: messageData.Content ?? null,
                        embeds: message.embeds ? messageData.Embeds : null,
                        files: messageData?.Attachments?.map((a) =>
                            new AttachmentBuilder(a.buffer).setName(a.name)
                        ) ?? null,
                        components: message.components ? messageData.Components : null,

                        withComponents: true,
                        username: message.author.username,
                        avatarURL: message.author.displayAvatarURL(),
                    })
                    .then(async (msg) => {

                        if (data.SyncFlags.length > 1 && data.SyncFlags.includes("add_reactions")) {
                            const channel = await client.channels.fetch(msg.channel_id)
                            await (channel as GuildTextBasedChannel).messages.react(msg.id, "✅")
                        }

                        await database.syncedChannelLinkMessages.create({
                            data: {
                                UserMessageId: message.id,
                                WebhookMessageId: msg.id,
                                ChannelId: message.channelId,
                                GuildId: message.guildId,
                                WebhookUrl: webhook.url,
                                ChannelLinkId: data.UUID
                            }
                        });
                    });

            }
        } catch (e) {
            console.log(e)
        }
    }
}

