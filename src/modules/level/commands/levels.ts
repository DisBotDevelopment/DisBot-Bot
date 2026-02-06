import {
    ActionRowBuilder, ApplicationIntegrationType, ButtonBuilder, ButtonStyle,
    ChannelType, ChatInputCommandInteraction,
    CommandInteraction, ContainerBuilder,
    InteractionContextType, MessageFlags,
    PermissionsBitField,
    SlashCommandBuilder, TextDisplayBuilder, UserSelectMenuBuilder
} from "discord.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    help: {
        name: 'Levels Management',
        description: 'Manage all Level Features',
        usage: '/levels',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/levels'
    },
    data: new SlashCommandBuilder()
        .setName("levels")
        .setDescription("Levels Module")
        .setDescriptionLocalizations({de: "Levels Module"})
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

    async execute(interaction: ChatInputCommandInteraction) {

        const data = await database.levelSettings.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        })
        if (!data) {
            await database.levelSettings.create({
                data: {
                    Guilds: {
                        connect: {
                            GuildId: interaction.guild.id
                        }
                    },
                }
            })
        }

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("wandsparkles")} Levels`,
                                    ``,
                                    `- Manage the Level Settings`,
                                    `- View and change user settings`,
                                    `- Edit Message and customize the Module.`
                                ].join("\n")
                            )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-settings-general")
                                .setEmoji("<:wandsparkles:1433176825764249651>")
                                .setLabel("General Settings")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-messages")
                                .setEmoji("<:message:1322252985702551767>")
                                .setLabel("Message Template Settings")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-channels")
                                .setEmoji("<:text:1199381324117594182>")
                                .setLabel("Message Level Settings")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-voice")
                                .setEmoji("<:voice:1199381325694632067>")
                                .setLabel("Voice Level Settings")
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-settings-leaderboard")
                                .setEmoji("<:chartarea:1433176507198476429>")
                                .setLabel("Leaderboard Settings")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-xpdrops")
                                .setEmoji("<:package:1365715766623604746>")
                                .setLabel("XP Drops Settings")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-streaks")
                                .setEmoji("<:flame:1433571082614603856>")
                                .setLabel("Streaks Settings")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-roles")
                                .setEmoji("<:role:1335667919119585480>")
                                .setLabel("Level Role Settings")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-decay")
                                .setEmoji("<:timer:1321939051921801308>")
                                .setLabel("Decay Settings")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("user")} Manage User Settings\n-# Select a User to load the User settings.`)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId("levels-user-settings")
                        )
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("preview")} View current Level Settings`)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-view-all")
                                .setLabel("View Settings")
                                .setEmoji("<:preview:1288230393757171825>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setURL("https://doc.xyzhub.link/s/disbot/doc/level-ovQLaZHB6x")
                                .setLabel("Docs")
                                .setEmoji("<:outline:1438974310042697909>")
                                .setStyle(ButtonStyle.Link)
                        )
                    )
            ]
        })

    }
};
