import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "leave-image-create-setup",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const background = interaction.fields.getTextInputValue(
            "leave-image-create-background"
        );
        const theme = interaction.fields
            .getTextInputValue("leave-image-create-theme")
            .toLowerCase();
        const color = interaction.fields.getTextInputValue(
            "leave-image-create-color"
        );

        const data = await database.guildLeaveSetup.findFirst({
            include: {
                ImageData: true
            },
            where: {
                GuildId: interaction.guild?.id
            }
        });

        await database.leaveImageData.update(
            {
                where: {
                    GuildLeaveSetupId: interaction.guild?.id
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

        if (!client.user) throw new Error("Client user is not cached.");

        await interaction.reply({
            content: `## ${await convertToEmojiToPng(
                "check"
            )} Leave Image has been updated!`,
            flags: MessageFlags.Ephemeral
        });
    }
};
