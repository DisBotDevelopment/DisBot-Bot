import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "welcome-image-create-setup",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const background = interaction.fields.getTextInputValue(
            "welcome-image-create-background"
        );
        const theme = interaction.fields
            .getTextInputValue("welcome-image-create-theme")
            .toLowerCase();
        const color = interaction.fields.getTextInputValue(
            "welcome-image-create-color"
        );

        const data = await database.guildWelcomeSetup.findFirst({
            include: {
                ImageData: true
            },
            where: {
                GuildId: interaction.guild?.id
            }
        });

        await database.welcomeImageData.update(
            {
                where: {
                    GuildWelcomeSetupId: interaction.guild?.id
                },
                data: {
                    Background: background,
                    Theme: theme,
                    Gradient: color,
                    Color: data?.ImageData?.Color,
                    Title: data?.ImageData?.Title,
                    Subtitle: data?.ImageData?.Subtitle,
                    Text: data?.ImageData?.Text
                }
            }
        );
        if (!client.user) throw new Error("Client not found");

        await interaction.reply({
            content: `## ${await convertToEmojiToPng(
                "check"
            )} Welcome Image has been updated!`,
            flags: MessageFlags.Ephemeral
        });
    }
};
