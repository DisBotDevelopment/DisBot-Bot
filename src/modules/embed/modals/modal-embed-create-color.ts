import {Client, ColorResolvable, EmbedBuilder, ModalSubmitInteraction, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "modal-embed-create-color",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const color = interaction.fields.getTextInputValue(
            "embed-create-options-color-color-input"
        );

        const [, messageId, embedIndexStr] = interaction.customId.split(":");
        const embedIndex = Number(embedIndexStr ?? "0");

        const message = await interaction.channel.messages.fetch(messageId);
        const embeds = message.embeds.map(e => new EmbedBuilder(e.data)); // alte Embeds klonen

        if (!embeds[embedIndex]) {
            return interaction.reply({
                content: "## ❌ I can't find the embed at this index!",
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            embeds[embedIndex].setColor(color ? (color as ColorResolvable) : "#2B2D31");

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
        } catch (e) {
            if (!client.user) throw new Error("No Client");
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Please use a valid hex color code!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
