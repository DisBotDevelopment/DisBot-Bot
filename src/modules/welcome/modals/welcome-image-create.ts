import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ContainerBuilder,
    EmbedBuilder, MessageFlags,
    ModalSubmitInteraction,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

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

        if (!data.ChannelId) return interaction.reply({
            content: `## ${await convertToEmojiToPng("error")} There are no Channel set.`,
            flags: MessageFlags.Ephemeral,
        })

        const imageData = await database.welcomeImageData.findFirst({
            where: {
                GuildWelcomeSetupId: interaction.guild.id
            }
        })


        if (!imageData) {
            await database.welcomeImageData.create(
                {
                    data: {
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
                        Background: "",
                        GuildWelcomeSetup: {
                            connect: {
                                GuildId: interaction.guild.id
                            }
                        }
                    }
                }
            );
        }

        await database.welcomeImageData.update(
            {
                where: {
                    GuildWelcomeSetupId: data.GuildId
                },
                data: {
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
                    Background: "",
                }
            }
        );


        await database.guildWelcomeSetup.update(
            {
                where: {
                    GuildId: interaction.guild?.id
                },
                data: {
                    Image: true,
                }
            }
        );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("welcome-image-create-button-setup")
                .setLabel("Create Image Card")
                .setEmoji("<:imageadd:1260148502449754112>")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addActionRowComponents(row)
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });
    }
};
