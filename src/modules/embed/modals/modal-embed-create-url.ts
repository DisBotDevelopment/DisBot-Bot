import { Client, EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { URL_PLACEHOLDER } from "../../../main/placeholder.js";

export default {
    id: "modal-embed-create-url",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const url = interaction.fields.getTextInputValue(
            "embed-create-options-url-url"
        );

        let link = url.trim();
        for (const [placeholder, value] of Object.entries(URL_PLACEHOLDER)) {
            if (link.includes(placeholder)) {
                link = link.replace(placeholder, value);
            }
        }

        if (!link.includes("://")) {
            return interaction.reply({
                content: "## You need to provide a valid URL for the embed",
                flags: MessageFlags.Ephemeral
            });
        }

        const [ , messageId, embedIndexStr ] = interaction.customId.split(":");
        const embedIndex = Number(embedIndexStr ?? "0");

        const message = await interaction.channel.messages.fetch(messageId);
        const embeds = message.embeds.map(e => new EmbedBuilder(e.data));

        if (!embeds[embedIndex]) {
            return interaction.reply({
                content: "## I can't find the embed at this index!",
                flags: MessageFlags.Ephemeral,
            });
        }
        
        embeds[embedIndex].setURL(link);

        if (message.webhookId) {
            const webhooks = await interaction.guild?.fetchWebhooks();
            const webhook = webhooks?.find((wh) => wh.id === message.webhookId);

            if (!webhook) {
                return interaction.reply({
                    content: "## ❌ I can't find the webhook for this message!",
                    flags: MessageFlags.Ephemeral,
                });
            }

            await interaction.deferUpdate();
            return await webhook.editMessage(message.id, { embeds });
        }

        await interaction.deferUpdate();
        await message.edit({ embeds });
    }
};
