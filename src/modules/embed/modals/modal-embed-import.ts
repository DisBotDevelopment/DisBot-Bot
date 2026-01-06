import {EmbedBuilder, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "modal-embed-import",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {

            const [, messageId, embedIndexStr] = interaction.customId.split(":");
            const embedIndex = Number(embedIndexStr ?? "0");

            const message = await interaction.channel.messages.fetch(messageId);
            const embeds = message.embeds.map(e => new EmbedBuilder(e.data));

            let newEmbed;
            try {
                const json = JSON.parse(interaction.fields.getTextInputValue("embed-import-input"));
                newEmbed = new EmbedBuilder(json);
            } catch (err) {
                return interaction.reply({
                    content: `## ${await convertToEmojiToPng("error")} Invalid JSON!`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            embeds[embedIndex] = newEmbed;

            if (message.webhookId) {
                const webhooks = await interaction.guild?.fetchWebhooks();
                const webhook = webhooks?.find((wh) => wh.id == message.webhookId);

                if (!webhook) {
                    return interaction.reply({
                        content: `## ${await convertToEmojiToPng("error")} I can't find the webhook for this message!`,
                        flags: MessageFlags.Ephemeral,
                    });
                }

                try {
                    await interaction.deferUpdate();
                    return await webhook.editMessage(message.id, {embeds});
                } catch (err) {
                    console.error(err);
                    return interaction.reply({
                        content: `## ${await convertToEmojiToPng("error")} Failed to edit the message via webhook!`,
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }

            await message.edit({embeds});
            await interaction.reply({
                content: `## ${await convertToEmojiToPng("check")} The embed has been imported successfully.`,
                flags: MessageFlags.Ephemeral
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content:
                    "## An error occurred while trying to import the embed.\n" +
                    "-# Please make sure the JSON is valid.\n" +
                    "-# Check that you have a Description, Title, Thumbnail or Image."
            });
        }
    }
};
