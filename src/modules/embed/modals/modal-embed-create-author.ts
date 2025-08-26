import {EmbedBuilder, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "modal-embed-create-author",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const author = interaction.fields.getTextInputValue(
            "embed-create-options-author-input"
        );

        const [, messageId, embedIndexStr] = interaction.customId.split(":");
        const embedIndex = Number(embedIndexStr ?? "0");

        const message = await interaction.channel.messages.fetch(messageId);
        const embeds = message.embeds.map(e => new EmbedBuilder(e.data));

        if (!embeds[embedIndex]) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} I can't find the embed at index ${embedIndex}!`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const oldAuthor = embeds[embedIndex].data.author;
        embeds[embedIndex].setAuthor({
            name: author,
            iconURL: oldAuthor.icon_url ?? undefined,
            url: oldAuthor.url ?? undefined,
        });

        if (message.webhookId) {
            const webhooks = await interaction.guild?.fetchWebhooks();
            const webhook = webhooks?.find((wh) => wh.id === message.webhookId);

            if (!webhook) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} I can't find the webhook for this message!`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            try {
                await interaction.deferUpdate();
                return await webhook.editMessage(message.id, {embeds});
            } catch (err) {
                console.error(err);
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} Failed to edit the message via webhook!`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

        await interaction.deferUpdate();
        await message.edit({embeds});
    }
};
