import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ContainerBuilder,
    EmbedBuilder, MessageFlags,
    ModalSubmitInteraction,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        const imageData = await database.leaveImageData.findFirst({
            where: {
                GuildLeaveSetupId: interaction.guild.id
            }
        })


        if (!imageData) {
            await database.leaveImageData.create(
                {
                    data: {
                        Title: interaction.fields.getTextInputValue(
                            "leave-image-create-title"
                        ),
                        Subtitle: interaction.fields.getTextInputValue(
                            "leave-image-create-subtitle"
                        ),
                        Text: interaction.fields.getTextInputValue(
                            "leave-image-create-text"
                        ),
                        Color: interaction.fields.getTextInputValue(
                            "leave-image-create-color"
                        ),
                        Gradient: "",
                        Theme: "",
                        Background: "",
                        GuildLeaveSetup: {
                            connect: {
                                GuildId: interaction.guild.id
                            }
                        }
                    }
                }
            );
        }


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
                .setCustomId("leave-image-create-button-setup")
                .setLabel("Create Image Card")
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
