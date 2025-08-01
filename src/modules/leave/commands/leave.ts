import { ChannelType, InteractionContextType, PermissionsBitField, SlashCommandBuilder } from "discord.js";

export default {
  help: {
    name: 'Leave',
    description: 'Leave Steup',
    usage: '/leave',
    examples: [],
    aliases: [],
    docsLink: 'https://docs.disbot.app/docs/commands/leave'
  },
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave Steup")
    .setDescriptionLocalizations({ de: "Leave System Setup" })
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)

    .addSubcommand((subCommand) =>
      subCommand
        .setName("message")
        .setDescription("Use a Message for the Leave System")
        .setDescriptionLocalizations({
          de: "Nutze eine Nachricht für das Leave System"
        })

        .addChannelOption((options) =>
          options
            .setName("channel")
            .setDescription("Set the Leave Channel")
            .setDescriptionLocalizations({ de: "Setze den Leave Channel" })
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
            .setDescription("Set the Willkommen Channel")
            .setDescriptionLocalizations({ de: "Setze den Willkommen Channel" })
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
        .setDescription("Remove the Messages from the Database.")
        .setDescriptionLocalizations({
          de: "Entferne die Nachrichten aus der Datenbank."
        })
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("toggle")
        .setDescription("Toggle Leave System")
        .setDescriptionLocalizations({
          de: "Schalte Leave System aus/an"
        })
        .addStringOption((option) =>
          option
            .setName("toggle")
            .setDescription("Toggle Leave System")
            .setDescriptionLocalizations({
              de: "Schalte Leave System aus/an"
            })
            .setRequired(true)
            .addChoices(
              {
                name: "✅ Activate the System",
                value: "on",
                name_localizations: { de: "✅ Aktiviere das System" }
              },
              {
                name: "❌ Deactivate the System",
                value: "off",
                name_localizations: { de: "❌ Deaktiviere das System" }
              }
            )
        )
    )
};
