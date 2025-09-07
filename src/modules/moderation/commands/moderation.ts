import {InteractionContextType, PermissionsBitField, SlashCommandBuilder,} from "discord.js";

export default {
    help: {
        name: 'Moderation Commands',
        description: 'Manage the moderation of the server',
        usage: '/moderation',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/moderation'
    },
    data: new SlashCommandBuilder()
        .setName("moderation")
        .setDescription("Manage the moderation of the server")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
        .addSubcommand((subcommand) =>
            subcommand.setName("ban").setDescription("Ban a user from the server")
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("kick").setDescription("Kick a user from the server")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("automod")
                .setDescription("Automoderate your server with Disbot and Discord")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("timeout")
                .setDescription("Timeout a user from the server")
        ).addSubcommand((subcommand) =>
            subcommand
                .setName("scout")
                .setDescription("Scout is a Moderation List to moderate suspicious users.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("user")
                .setDescription("Get information about a user an the Moderation History")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user to get information about")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("clear")
                .setDescription("Clear Messages from a channel")
                .addIntegerOption((options) =>
                    options
                        .setName("amount")
                        .setDescription("Amount of messages to delete")
                        .setMaxValue(100)
                        .setMinValue(1)
                        .setRequired(true)
                )
        ),
};
