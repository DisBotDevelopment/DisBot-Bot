import {Client, EmbedBuilder, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "modal-embed-create-filds-add",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const name = interaction.fields.getTextInputValue(
            "embed-create-options-filds-add-name"
        );
        const description = interaction.fields.getTextInputValue(
            "embed-create-options-filds-add-description"
        );
        const inline = interaction.fields.getTextInputValue(
            "embed-create-options-filds-add-inline"
        );

        if (!client.user) throw new Error("Client user is not cached.");

        if (inline !== "true" && inline !== "false")
            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "error"
                )} Invalid inline value, please use "true" or "false".`,
                flags: MessageFlags.Ephemeral
            });

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

        embeds[embedIndex].addFields({
            name,
            value: description,
            inline: inline === "true"
        });
 
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
