import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-show-embed",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const data = await database.vanityEmbed.findFirst({
            where: {
                VanityId: interaction.customId.split(":")[1]
            },
            include: {
                Author: true
            }
        });


        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        [`## ${await convertToEmojiPng("link", client.user.id)} Vanity Embed`,
                            ``,
                            `${await convertToEmojiPng("message", client.user.id)} **Title**: ${data.Title ?? "N/A"}`,
                            `${await convertToEmojiPng("message", client.user.id)} **Description**: ${data.Description ?? "N/A"}`,
                            `${await convertToEmojiPng("color", client.user.id)} **Color**: ${data.Color ?? "N/A"}`,
                            `${await convertToEmojiPng("image", client.user.id)} **Image**: ${data.ImageUrl ?? "N/A"}`,
                            `${await convertToEmojiPng("image", client.user.id)} **Thumbnail**: ${data.ThumbnailUrl ?? "N/A"}`,
                            `${await convertToEmojiPng("signature", client.user.id)} **Author**:`,
                            `- ${await convertToEmojiPng("renamesolid24", client.user.id)} **Name**: ${data.Author?.Name ?? "N/A"}`,
                            `- ${await convertToEmojiPng("link", client.user.id)} **Url**: ${data.Author?.URL ?? "N/A"}`,
                            `- ${await convertToEmojiPng("image", client.user.id)} **Icon**: ${data.Author?.IconURL ?? "N/A"}`,
                        ].join("\n"))
            ],
            flags: MessageFlags.Ephemeral,
        })
    }
};
