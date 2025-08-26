import {Client, EmbedBuilder, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "modal-embed-create-filds-remove",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const fieldIndex =
                parseInt(
                    interaction.fields.getTextInputValue(
                        "embed-create-options-filds-remove-field"
                    ),
                    10
                ) - 1;

            if (!client.user) throw new Error("Client user is not available");

            if (isNaN(fieldIndex) || fieldIndex < 0) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} Invalid field number. Please try again.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            const [, messageId, embedIndexStr] = interaction.customId.split(":");
            const embedIndex = Number(embedIndexStr ?? "0");

            const message = await interaction.channel.messages.fetch(messageId);
            const embeds = message.embeds.map(e => new EmbedBuilder(e.data));

            embeds[embedIndex].spliceFields(fieldIndex, 1);

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
                return await webhook.editMessage(message.id, {embeds});
            }

            await interaction.deferUpdate();
            await message.edit({embeds});
        } catch (error) {
            console.error("Error in embed editor while removing field:", error);
            if (!client.user) throw new Error("Client user is not available");
            interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} An error occurred while removing the field. Please try again.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
