import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-update-author-modal",

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

        const newSlug = interaction.fields.getTextInputValue("vanity-update-author-input");
        const icon = interaction.fields.getTextInputValue("vanity-update-author-icon-input");
        const newImage = interaction.fields.getTextInputValue("vanity-update-author-url-input");

        if (!data) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} This vanity URL is not found.`,
            });
            return;
        }

        if (!icon.startsWith("http") && !icon.endsWith(".png") || !icon.endsWith(".jpg") || !icon.endsWith(".jpeg")) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} The icon URL must be a valid image URL ending with .png, .jpg, or .jpeg.`,
            });
            return;
        }

        if (!newImage.startsWith("http")) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} The author URL must be a valid URL starting with http.`,
            });
            return;
        }

        await database.vanityEmbedAuthors.update({
                where: {
                    VanityEmbedsId: interaction.customId.split(":")[1]
                },
                data: {
                    Name: newSlug,
                    IconURL: icon,
                    URL: newImage
                }
            }
        )

        await interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} The author of the vanity URL has been updated to \`${newSlug}\`.`,
        })

    }
};
