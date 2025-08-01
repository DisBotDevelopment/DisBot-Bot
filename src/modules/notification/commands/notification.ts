import { ChannelType, InteractionContextType, PermissionsBitField, SlashCommandBuilder, } from "discord.js";

export default {
  help: {
    name: 'Notification',
    description: 'Setup a notification for some Social Media Platforms',
    usage: '/notification',
    examples: [],
    aliases: [],
    docsLink: 'https://docs.disbot.app/docs/commands/notification'
  },
  data: new SlashCommandBuilder()
    .setName("notification")
    .setContexts(InteractionContextType.Guild)
    .setDescription("Setup a notification for some Social Media Platforms")
    .setDescriptionLocalizations({
      de: "Richte eine Benachrichtigung für einige Social Media Plattformen ein",
    })
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addSubcommand((subCommand) =>
      subCommand
        .setName("twitch")
        .setDescription("Manage Twitch Channel notification")
        .setDescriptionLocalizations({
          de: "Verwalte Twitch Channel Benachrichtigung",
        })
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("spotify")
        .setDescription("Manage Spotify Channel notification")
        .setDescriptionLocalizations({
          de: "Verwalte Spotify Channel Benachrichtigung",
        })
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("youtube")
        .setDescription("Manage YouTube Channel notification")
        .setDescriptionLocalizations({
          de: "Verwalte YouTube Channel Benachrichtigung",
        })
    ),
};
