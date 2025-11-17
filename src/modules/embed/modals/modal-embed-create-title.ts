import {Client, EmbedBuilder, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    id: "modal-embed-create-title",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const title = interaction.fields.getTextInputValue(
            "embed-create-options-title-title"
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

        embeds[embedIndex].setTitle(title);

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
