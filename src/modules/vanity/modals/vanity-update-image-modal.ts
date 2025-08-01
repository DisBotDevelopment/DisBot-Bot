import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-update-image-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client is not ready");
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const data = await database.vanitys.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        const newSlug = interaction.fields.getTextInputValue("vanity-update-image-thumbnail-input");
        const newImage = interaction.fields.getTextInputValue("vanity-update-image-image-input");

        if (!data) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} This vanity URL is not found.`,
            });
            return;
        }

        if (!newSlug.startsWith("http") || !newSlug.endsWith(".png") && !newSlug.endsWith(".jpg") && !newSlug.endsWith(".jpeg")) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} The thumbnail URL must start with "http" and end with ".png", ".jpg" or ".jpeg".`,
            });
            return;
        }

        if (!newImage.startsWith("http") || !newImage.endsWith(".png") && !newImage.endsWith(".jpg") && !newImage.endsWith(".jpeg")) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} The image URL must start with "http" and end with ".png", ".jpg" or ".jpeg".`,
            });
            return;
        }


        await database.vanityEmbeds.update({
            where: {
                VanityId: interaction.customId.split(":")[1]
            },
            data: {
                ThumbnailUrl: newSlug,
                ImageUrl: newImage
            }
        })

        await interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} The image and thumbnail of the vanity URL have been updated.`,
        })

    }
};
