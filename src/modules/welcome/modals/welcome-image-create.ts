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

export default {
    id: "welcome-image-create",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const data = await database.guildWelcomeSetup.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        });

        if (!data) {
            await database.guildWelcomeSetup.create({
                data: {
                    Guilds: {
                        connect: {
                            GuildId: interaction.guild?.id,
                        }
                    },
                    ChannelId: interaction.fields.getTextInputValue(
                        "welcome-message-create-channel"
                    ),
                    MessageTemplateId: null,
                    Image: true,
                    ImageData: {
                        Title: interaction.fields.getTextInputValue(
                            "welcome-image-create-title"
                        ),
                        Subtitle: interaction.fields.getTextInputValue(
                            "welcome-image-create-subtitle"
                        ),
                        Text: interaction.fields.getTextInputValue(
                            "welcome-image-create-text"
                        ),
                        Color: interaction.fields.getTextInputValue(
                            "welcome-image-create-color"
                        ),
                        Gradient: "",
                        Theme: "",
                        Background: ""
                    }
                }
            });
        }

        await database.guildWelcomeSetup.update(
            {
                where: {
                    GuildId: interaction.guild?.id
                },
                data: {
                    Image: true,
                    ImageData: {
                        Title: interaction.fields.getTextInputValue(
                            "welcome-image-create-title"
                        ),
                        Subtitle: interaction.fields.getTextInputValue(
                            "welcome-image-create-subtitle"
                        ),
                        Text: interaction.fields.getTextInputValue(
                            "welcome-image-create-text"
                        ),
                        Color: interaction.fields.getTextInputValue(
                            "welcome-image-create-color"
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
                .setCustomId("welcome-image-create-button-setup")
                .setLabel("Setup the Image")
                .setStyle(ButtonStyle.Success)
        );

        interaction.reply({
            content: `${interaction.fields.getTextInputValue(
                "welcome-message-create-channel"
            )}`,
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        [
                            `## DONE! Image text has been set up!`,
                            `Now Edit the image and background. Use the Button below to setup the image.`
                        ].join("\n")
                    )
                    .setColor("#2B2D31")
            ],
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
};
