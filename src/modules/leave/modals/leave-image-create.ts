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
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "leave-image-create",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const data = await database.guildLeaveSetups.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        });

        if (!data) {
            await database.guildLeaveSetups.create({
                data: {
                    GuildId: interaction.guild?.id,
                    ChannelId: interaction.fields.getTextInputValue(
                        "leave-message-create-channel"
                    ),
                    Image: true,
                    ImageData: {
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
            });
        }

        await database.guildLeaveSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id
                },
                data: {
                    Image: true,
                    ImageData: {
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
            }
        );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("leave-image-create-button-setup")
                .setLabel("Setup the Image")
                .setStyle(ButtonStyle.Success)
        );

        await interaction.reply({
            components: [row],
            content: `## ${await convertToEmojiPng("image", client.user.id)} Please setup the background and other image related options.`,
            flags: MessageFlags.Ephemeral
        });
    }
};
