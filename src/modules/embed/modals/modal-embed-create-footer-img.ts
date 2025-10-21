import {Client, EmbedBuilder, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {IMAGE_PLACEHOLDER} from "../../../main/placeholder.js";

export default {
    id: "modal-embed-create-footer-img",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const img = interaction.fields.getTextInputValue(
                "embed-create-options-footer-img-input"
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

            let imgURL = img;
            for (const [key, value] of Object.entries(IMAGE_PLACEHOLDER)) {
                if (img.includes(key)) {
                    imgURL = img.replace(key, value);
                }
            }

            const oldFooter = embeds[embedIndex].data.footer

            embeds[embedIndex].setFooter({
                text: oldFooter?.text ?? null,
                iconURL: imgURL ?? null
            });

            if (message.webhookId) {
                const webhooks = await interaction.guild?.fetchWebhooks();
                const webhook = webhooks?.find((wh) => wh.id === message.webhookId);

                if (!webhook) {
                    return interaction.reply({
                        content: `## I can't find the webhook for this message!`,
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
            if (!client.user) throw new Error("No Client");
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} An error occurred while trying to set the image. - **Please set a Footer first**`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
