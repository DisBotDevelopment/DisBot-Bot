import { ChannelType, PermissionsBitField, SlashCommandBuilder } from "discord.js";

export default {
  help: {
    name: 'Info Command',
    description: 'Get Information about the Server, User, Role or Channel',
    usage: '/info',
    examples: [],
    aliases: [],
    docsLink: 'https://docs.disbot.app/docs/commands/info'
  },
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get Information about the Server, User, Role or Channel")
    .setDescriptionLocalizations({
      de: "Erhalte Informationen über den Server, User, Rolle oder Channel",
    })
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addSubcommand((subCommand) =>
      subCommand
        .setName("server")
        .setDescription("Show Information about the server")
        .setDescriptionLocalizations({
          de: "Zeige Informationen über den Server",
        })
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("user")
        .setDescription("Show Information about a User")
        .setDescriptionLocalizations({
          de: "Zeige Informationen über einen User",
        })

        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The User you want to get the Information from")
            .setDescriptionLocalizations({
              de: "Der User von dem du die Informationen haben möchtest",
            })
            .setRequired(false)
        )
    )


    .addSubcommand((subCommand) =>
      subCommand
        .setName("invite")
        .setDescription("Show Information about an Discord.gg Invite")
        .setDescriptionLocalizations({
          de: "Zeige Informationen über einen Discord.gg Invite",
        })

        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The Invite URL you want to get the Information from")
            .setDescriptionLocalizations({
              de: "Die Einladungs-URL von der du die Informationen haben möchtest",
            })
            .setRequired(true)
        )
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("role")
        .setDescription("Show Information about a Role")
        .setDescriptionLocalizations({
          de: "Zeige Informationen über eine Rolle",
        })

        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The Role you want to get the Information from")
            .setDescriptionLocalizations({
              de: "Die Rolle von der du die Informationen haben möchtest",
            })
            .setRequired(true)
        )
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("channel")
        .setDescription("Show Information about the server")
        .setDescriptionLocalizations({
          de: "Zeige Informationen über den Server",
        })

        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The Channel you want to get the Information from")
            .setDescriptionLocalizations({
              de: "Der Channel von dem du die Informationen haben möchtest",
            })
            .setRequired(true)
        )
    ),
};
