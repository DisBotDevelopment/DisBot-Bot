import {
    ActionRowBuilder, AttachmentBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    ChannelType,
    ContainerBuilder, FileBuilder,
    MessageFlags,
    TextChannel,
    TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "utility-export-guild",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {


        if (interaction.user.id != interaction.guild.ownerId) {
            return interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("errorred")} This interaction is only for guild owners.`
            })
        }

        const data = await database.guilds.findFirst({
            include: {
                AutoAutoDeletes: true,
                AutoPublish: true,
                AutoReacts: true,
                AutoRoles: true,
                GuildDisBotAutoModeration: true,
                Giveaways: true,
                GuildUserModeration: true,
                DiscordAddons: true,
                GuildChannelLinks: true,
                GuildCommandManger: {
                    include: {
                        BuildInCommands: true
                    }
                },
                GuildComponentManager: true,
                GuildFeatureToggle: true,
                GuildInteractionPermissions: true,
                GuildLeaveSetup: true,
                GuildLogs: true,
                GuildLogging: true,
                GuildWelcomeSetup: true,
                Polls: true,
                MessageTemplates: true,
                ModerationScout: {
                    include: {
                        UserAppeals: true,
                        ModerationScoutReports: true,
                        ModerationScoutReportModalData: true,
                        ModerationScoutForms: {
                            include: {
                                ModerationScoutUserAppeals: true,
                                ModerationScoutFormsData: {
                                    include: {
                                        ModerationScoutForms: {
                                            include: {
                                                ModerationScoutUserAppeals: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                Security: {
                    include: {
                        VerificationGates: true
                    }
                },
                SpotifyNotifications: true,
                LevelSettings: {
                    include: {
                        XPStreaks: true,
                        LevelRoles: true,
                        XPDrops: true,
                        Levels: true,
                    }
                },
                TicketSetups: {
                    include: {
                        TicketPermissions: true,
                        ModalOptions: true,
                        Tickets: true
                    }
                },
                TwitchNotifications: true,
                YoutubeNotifications: true,
            },
            where: {
                GuildId: interaction.guild.id
            }
        })

        const string = JSON.stringify(data)

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("export")} Download your GuildData Export ${new Date().toDateString()}`)
                    )
                    .addFileComponents(
                        new FileBuilder().setURL(`attachment://GuildData-${interaction.guild.name}.json`).setSpoiler(true)
                    )
            ],
            files: [
                new AttachmentBuilder(Buffer.from(string)).setName(`GuildData-${interaction.guild.name}.json`),
            ]
        })


    }
};
