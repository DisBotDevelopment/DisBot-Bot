import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags, TextDisplayBuilder, TextDisplayComponent
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
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

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        })
        await interaction.editReply({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("link")} Vanity Embed`,
                                    ``,
                                    `${await convertToEmojiToPng("message")} **Title**: ${data.Title ?? "N/A"}`,
                                    `${await convertToEmojiToPng("message")} **Description**: ${data.Description ?? "N/A"}`,
                                    `${await convertToEmojiToPng("color")} **Color**: ${data.Color ?? "N/A"}`,
                                    `${await convertToEmojiToPng("image")} **Image**: ${data.ImageUrl ?? "N/A"}`,
                                    `${await convertToEmojiToPng("image")} **Thumbnail**: ${data.ThumbnailUrl ?? "N/A"}`,
                                    `${await convertToEmojiToPng("signature")} **Author**:`,
                                    `- ${await convertToEmojiToPng("renamesolid24")} **Name**: ${data.Author?.Name ?? "N/A"}`,
                                    `- ${await convertToEmojiToPng("link")} **Url**: ${data.Author?.URL ?? "N/A"}`,
                                    `- ${await convertToEmojiToPng("image")} **Icon**: ${data.Author?.IconURL ? `[Open Icon Image](${data.Author?.IconURL})` : "N/A"}`,
                                ].join("\n")
                            )
                    )
            ],
            flags: MessageFlags.IsComponentsV2,
        })
    }
};
