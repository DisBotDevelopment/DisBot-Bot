import {EmbedBuilder, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {IMAGE_PLACEHOLDER} from "../../../main/placeholder.js";

export default {
    id: "modal-embed-create-image",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const img = interaction.fields.getTextInputValue(
                "embed-create-options-image-image-input"
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

            let imgUrl = img;
            for (const [key, value] of Object.entries(IMAGE_PLACEHOLDER)) {
                if (imgUrl.includes(key)) {
                    imgUrl = imgUrl.replace(key, value);
                }
            }
            embeds[embedIndex].setImage(imgUrl ?? null);

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
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "An error occurred while trying to set the image.",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
