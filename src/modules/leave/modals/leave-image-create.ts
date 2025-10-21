import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder, MessageFlags,
    ModalSubmitInteraction,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "leave-image-create",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const data = await database.guildLeaveSetup.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        });

        if (!data.ChannelId) return interaction.reply({
            content: `## ${await convertToEmojiToPng("error")} There are no Channel set.`,
            flags: MessageFlags.Ephemeral,
        })

        await database.guildLeaveSetup.update(
            {
                where: {
                    GuildId: interaction.guild?.id
                },
                data: {
                    Image: true,
                }
            }
        );
        await database.leaveImageData.update(
            {
                where: {
                    GuildLeaveSetupId: interaction.guild?.id
                },
                data: {
                    Title: interaction.fields.getTextInputValue(
                        "leave-image-create-title"
                    ),
                    Subtitle: interaction.fields.getTextInputValue(
                        "leave-image-create-subtitle"
                    ),
                    Text: interaction.fields.getTextInputValue("leave-image-create-text"),
                    Color: interaction.fields.getTextInputValue(
                        "leave-image-create-color"
                    ),
                    Gradient: "",
                    Theme: "",
                    Background: ""
                }
            }
        );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("leave-image-create-button-setup")
                .setLabel("Image Card Setup")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            components: [row],
            content: `## ${await convertToEmojiToPng("image")} Please setup the background and other image related options.`,
            flags: MessageFlags.Ephemeral
        });
    }
};
