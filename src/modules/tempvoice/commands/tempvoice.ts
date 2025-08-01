import {ChannelType, PermissionsBitField, SlashCommandBuilder} from "discord.js";

export default {
    help: {
        name: 'Temp Voice',
        description: 'Setup a temporary voice channel system',
        usage: '/tempvoice',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/tempvoice'
    },
    data: new SlashCommandBuilder()
        .setName("tempvoice")
        .setDescription("Setup a temporary voice channel system")
        .setDescriptionLocalizations({de: "Erstelle ein TempVoice Channels"})
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)

        .addSubcommand((subCommand) =>
            subCommand
                .setName("setup")
                .setDescription("setup join to create system")
                .setDescriptionLocalizations({
                    de: "Erstelle ein Join to Create System",
                })

                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription(
                            "Set the Voice Channel for the join to create system!"
                        )
                        .setDescriptionLocalizations({
                            de: "Setze den Voice Channel für das Join to Create System!",
                        })

                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildVoice)
                )

                .addChannelOption((option) =>
                    option
                        .setName("category")
                        .setDescription(
                            "Set the Category where the J2C Channels are Created for the join to create system!"
                        )
                        .setDescriptionLocalizations({
                            de: "Setze die Kategorie in der die J2C Channels erstellt werden!",
                        })
                        .addChannelTypes(ChannelType.GuildCategory)
                        .setRequired(true)
                )

                .addStringOption((option) =>
                    option
                        .setName("use-external-manage-channel")
                        .setDescription(
                            "Select if you want to use an external channel for the manage Embed!"
                        )
                        .setDescriptionLocalizations({
                            de: "Wähle ob du einen externen Channel für das Manage Embed verwenden möchtest!",
                        })
                        .addChoices(
                            {name: "Use a extra Channel for an Interface", value: "yes"},
                            {
                                name: "Use the Voice Channel for the Manage Embed",
                                value: "no",
                            }
                        )
                        .setRequired(true)
                )

                .addChannelOption((option) =>
                    option
                        .setName("manage-channel")
                        .setDescription("this is the Channel for the manage Embed!")
                        .setDescriptionLocalizations({
                            de: "Das ist der Channel für das Manage Embed!",
                        })
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(false)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("preset-limit")
                        .setDescription("Set the limit for the preset channels!")
                        .setDescriptionLocalizations({
                            de: "Setze das Limit für die Preset Channels!",
                        })

                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName("preset-name")
                        .setDescription("Set the name for the preset channels!")
                        .setDescriptionLocalizations({
                            de: "Setze den Namen für die Preset Channels!",
                        })

                        .setRequired(false)
                )
        )

        .addSubcommand((subCommand) =>
            subCommand
                .setName("remove")
                .setDescription("Remove a tempvoice system")
                .setDescriptionLocalizations({
                    de: "Entferne das Join to Create System",
                })
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The Voice Channel from the join to create system!")
                        .setDescriptionLocalizations({
                            de: "Der Voice Channel vom Join to Create System!",
                        })
                        .addChannelTypes(ChannelType.GuildVoice)
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("list")
                .setDescription("List all join to create channels")
                .setDescriptionLocalizations({
                    de: "Liste alle Join to Create Channels auf",
                })
        ),
};
