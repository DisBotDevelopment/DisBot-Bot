import {ChannelType, InteractionContextType, PermissionsBitField, SlashCommandBuilder,} from "discord.js";

const types = [
    {
        name: "🌎 All Logging Types",
        value: "all",
    },
    {
        name: "📝 Messages (Create, Delete, Update, Forward)",
        value: "message",
    },
    {
        name: "🔒 Channels (Create, Delete, Update, Permissions)",
        value: "channel",
    },
    {
        name: "🛡️ AutoMod (Create, Delete, Update)",
        value: "automod",
    },
    {
        name: "🔨 Moderation (Timeout, Ban, Kick)",
        value: "moderation",
    },
    {
        name: "🎭 Emoji (Create, Delete, Update)",
        value: "emoji",
    },
    {
        name: "🤝 Webhooks (Create, Update, Delte)",
        value: "webhook",
    },
    {
        name: "🔊 Stage (Create, Delete, Update)",
        value: "stage",
    },
    {
        name: "🎉 Event (Create, Delete, Update)",
        value: "event",
    },
    {
        name: "🎶 SoundBoard (Create, Delete, Update)",
        value: "soundboard",
    },
    {
        name: "👤 Member (Create, Delete, Update)",
        value: "member",
    },
    {
        name: "👑 Role (Create, Delete, Update)",
        value: "role",
    },
    {
        name: "📜 Sticker (Create, Delete, Update)",
        value: "sticker",
    },
    {
        name: "🔗 Invite (Create, Delete)",
        value: "invite",
    },
    {
        name: "🤖 Integrations (Add, Remove)",
        value: "integrations",
    },
    {
        name: "🏰 Guild (Edit)",
        value: "guild",
    },
    {
        name: "👍 Reaction (Remove, Remove All)",
        value: "reaction",
    },
    {
        name: "💯 Polls Vote (Add, Remove)",
        value: "polls",
    },
    {
        name: "🧵 Thread (Create, Delete, Update)",
        value: "thread",
    },
    {
        name: "🔊 Voice (Join, Switch, Leave)",
        value: "voice",
    },
];

export default {
    help: {
        name: 'Logging',
        description: 'Logging System',
        usage: '/logging',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/logging'
    },
    data: new SlashCommandBuilder()
        .setName("logging")
        .setDescription("Logging System")
        .setDescriptionLocalizations({de: "Logging System"})
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ViewAuditLog)

        .addSubcommand((subCommand) =>
            subCommand
                .setName("settings")
                .setDescription("Set the Settings for the Logging System")
                .setDescriptionLocalizations({
                    de: "Setze die Einstellungen für das Logging System",
                })

                .addStringOption((option) =>
                    option
                        .setName("logging")
                        .setDescription(
                            "Set the Logging Type for the Channel (Message Delete, Channel Delete, etc.)"
                        )
                        .setDescriptionLocalizations({
                            de: "Setze den Logging Typ für den Channel (Nachrichten Löschen, Channel Löschen, etc.)",
                        })
                        .setRequired(true)
                        .addChoices(types)
                )
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The Channel where the Messages should be sent.")
                        .setDescriptionLocalizations({
                            de: "Der Channel in dem die Nachrichten gesendet werden sollen.",
                        })
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )

        .addSubcommand((subCommand) =>
            subCommand
                .setName("toggle")
                .setDescription("Toggle the Logging System on or off")
                .setDescriptionLocalizations({
                    de: "Schalte das Logging System an oder aus",
                })

                .addStringOption((option) =>
                    option
                        .setName("toggle")
                        .setDescription("Toggle the Logging System on or off")
                        .setDescriptionLocalizations({
                            de: "Schalte das Logging System an oder aus",
                        })
                        .setRequired(true)
                        .addChoices(
                            {
                                name: "✅ Activate the System",
                                value: "on",
                                name_localizations: {de: "✅ Aktiviere das System"},
                            },
                            {
                                name: "❌ Deactivate the System",
                                value: "off",
                                name_localizations: {de: "❌ Deaktiviere das System"},
                            }
                        )
                )
        )

        .addSubcommand((subCommand) =>
            subCommand
                .setName("delete")
                .setDescription("Delete the Logging System")
                .setDescriptionLocalizations({
                    de: "Setzte das Logging System zurück",
                })

                .addStringOption((option) =>
                    option
                        .setName("delete")
                        .setDescription("Delete the Logging System")
                        .setDescriptionLocalizations({
                            de: "Setzte eine Einstellung zurück",
                        })
                        .setRequired(true)
                        .addChoices(types)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("transcript")
                .setDescription("Make a transskript from a channel")
                .setDescriptionLocalizations({
                    de: "Erstelle ein Transkript von einem Channel",
                })
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel to make the transcript from")
                        .setDescriptionLocalizations({
                            de: "Der Channel von dem das Transkript erstellt werden soll.",
                        })
                        .addChannelTypes(ChannelType.GuildText)
                )
        ),
};
