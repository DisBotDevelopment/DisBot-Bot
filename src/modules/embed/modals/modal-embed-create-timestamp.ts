import {EmbedBuilder, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {TIMESTAMP_PLACEHOLDER} from "../../../main/placeholder.js";

export default {
    id: "modal-embed-create-timestamp",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const timestamp = interaction.fields.getTextInputValue(
            "embed-create-options-timestamp-timestamp-input"
        );

        const [, messageId, embedIndexStr] = interaction.customId.split(":");
        const embedIndex = Number(embedIndexStr ?? "0");

        const message = await interaction.channel.messages.fetch(messageId);
        const embeds = message.embeds.map(e => new EmbedBuilder(e.data));

        if (!embeds[embedIndex]) {
            return interaction.reply({
                content: "## I can't find the embed at this index!",
                flags: MessageFlags.Ephemeral,
            });
        }

        let date = timestamp;
        for (const [key, value] of Object.entries(TIMESTAMP_PLACEHOLDER)) {
            if (date.includes(key)) {
                date = date.replace(key, value);
            }
        }

        embeds[embedIndex].setTimestamp(Date.parse(date));

        if (message.webhookId) {
            const webhooks = await interaction.guild?.fetchWebhooks();
            const webhook = webhooks?.find((wh) => wh.id === message.webhookId);

            if (!webhook) {
                return interaction.reply({
                    content: "## I can't find the webhook for this message!",
                    flags: MessageFlags.Ephemeral,
                });
            }

            await interaction.deferUpdate();
            return await webhook.editMessage(message.id, {embeds});
        }

        await interaction.deferUpdate();
        await message.edit({embeds});
    }
};
