import {ChannelType, PermissionsBitField, SlashCommandBuilder} from "discord.js";

export default {
    help: {
        name: 'Welcome',
        description: 'Welcome Steup',
        usage: '/welcome',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/welcome'
    },
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Welcome Steup")
        .setDescriptionLocalizations({de: "Willkommen System Setup"})
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)

        .addSubcommand((subCommand) =>
            subCommand
                .setName("message")
                .setDescription("Use a Message for the Welcome System")
                .setDescriptionLocalizations({
                    de: "Nutze eine Nachricht für das Willkommens System"
                })

                .addChannelOption((options) =>
                    options
                        .setName("channel")
                        .setDescription("Set the Welcome Channel")
                        .setDescriptionLocalizations({
                            de: "Setze den Willkommens Channel"
                        })
                        .addChannelTypes(
                            ChannelType.GuildText,
                            ChannelType.GuildAnnouncement
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("image")
                .setDescription("OoO, This Command is currently disabled because we are re-coding the image generation")
                .setDescriptionLocalizations({
                    de: "OoO, This Command is currently disabled because we are re-coding the image generation"
                })

                .addChannelOption((options) =>
                    options
                        .setName("channel")
                        .setDescription("Set the Welcome Channel")
                        .setDescriptionLocalizations({
                            de: "Setze den Willkommens Channel"
                        })
                        .addChannelTypes(
                            ChannelType.GuildText,
                            ChannelType.GuildAnnouncement
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("remove")
                .setDescription("Remove the Messages from the DB.")
        )

        .addSubcommand((subCommand) =>
            subCommand
                .setName("toggle")
                .setDescription("Toggle Welcome System on/off")
                .setDescriptionLocalizations({
                    de: "Schalte Willkommen System aus/an"
                })
                .addStringOption((option) =>
                    option
                        .setName("toggle")
                        .setDescription("Toggle Welcome System on/off")
                        .setDescriptionLocalizations({
                            de: "Schalte Willkommen System aus/an"
                        })
                        .setRequired(true)
                        .addChoices(
                            {
                                name: "✅ Activate the System",
                                value: "on",
                                name_localizations: {de: "✅ Aktiviere das System"}
                            },
                            {
                                name: "❌ Deactivate the System",
                                value: "off",
                                name_localizations: {de: "❌ Deaktiviere das System"}
                            }
                        )
                )
        )
};
