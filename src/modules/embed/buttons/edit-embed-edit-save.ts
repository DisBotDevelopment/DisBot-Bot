import {ButtonInteraction, EmbedBuilder, MessageFlags, TextInputStyle, WebhookClient} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "edit-embed-edit-save",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not cached.");
        const embeds = interaction.message.embeds[0].data;

        const embedbuilder = new EmbedBuilder(embeds);
        const message = await interaction.channel?.messages.fetch(
            interaction.customId.split(":")[1]
        );

        if (message?.webhookId != null) {

            const webhooks = await interaction.guild?.fetchWebhooks();
            const webhook = webhooks?.find(
                (wh) => wh.id === message.webhookId
            );
            if (!webhook) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} I can't find the webhook for this message!`,
                    flags: MessageFlags.Ephemeral
                });
            }

            webhook.editMessage(message.id, {
                embeds: [embedbuilder],
            }).catch(async (err) => {
                if (!client.user) throw new Error("Client user is not cached.");
                console.error(err);
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} Failed to edit the message via webhook!`,
                    flags: MessageFlags.Ephemeral,
                });
            });
        }

        message?.edit({
            embeds: [embedbuilder],
        });

        await interaction.message.delete();
        await interaction.deferUpdate();
    },
};
