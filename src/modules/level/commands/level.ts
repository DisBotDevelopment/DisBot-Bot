import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
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
        name: 'Level Command',
        description: 'View Level Streaks, leaderboard and Ranks.',
        usage: '/level',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/levels'
    },
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("Level Command")
        .setDescriptionLocalizations({de: "Level Command"})
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.UseApplicationCommands)
        .addSubcommand(subcommand =>
            subcommand
                .setName("stats")
                .setDescription("View User Stats")
                .addUserOption(builder =>
                    builder
                        .setName("member")
                        .setDescription("Member")
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("leaderboard")
                .setDescription("Level Leaderboard")
        )
};
