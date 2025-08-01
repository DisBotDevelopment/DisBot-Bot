import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default {
  help: {
    name: 'Chatfilter',
    description: 'Set up the ChatFilter System',
    usage: '/chatfilter',
    examples: [],
    aliases: [],
    docsLink: 'https://docs.disbot.app/docs/commands/chatfilter'
  },
  data: new SlashCommandBuilder()
    .setName("chatfilter")
    .setNameLocalizations({ de: "chatfilter" })
    .setDescription("Set up the ChatFilter System")
    .setDescriptionLocalizations({ de: "Richte das ChatFilter System ein" })
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

    .addSubcommand((subCommand) =>
      subCommand
        .setName("clear")
        .setDescription("Delete all words from the Chat Blacklist")
        .setDescriptionLocalizations({
          de: "Lösche alle Wörter aus der Chat Blacklist",
        })
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("import")
        .setDescription("Import a Chatfilter list")
        .setDescriptionLocalizations({
          de: "Importire eine Liste mit Wörtnern",
        })

        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("Provide here the sourceb.in url")
            .setDescriptionLocalizations({
              de: "Gebe hier deine sourceb.in URL an",
            })
            .setRequired(true)
        )
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("list")
        .setDescription("Show you a list of all words from the Chat Blacklist")
        .setDescriptionLocalizations({
          de: "Zeigt dir ein Liste von allen Wörtern aus der Chat Blacklist an",
        })
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("settings")
        .setNameLocalizations({ de: "einstellungen" })
        .setDescription("ChatFilter Settings")
        .setDescriptionLocalizations({ de: "ChatFilter Einstellungen" })

        .addChannelOption((option) =>
          option
            .setName("channel")
            .setNameLocalizations({ de: "kanal" })
            .setDescription("Setze den Log Channel")
            .setDescriptionLocalizations({ de: "Setze den Log Channel" })

            .addChannelTypes(ChannelType.GuildText)

            .setRequired(true)
        )
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("whitelist")
        .setDescription("ChatFilter Whitelist")
        .setDescriptionLocalizations({ de: "ChatFilter Whitelist" })

        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription("Choose an Option")
            .setDescriptionLocalizations({ de: "Wähle eine Option aus" })
            .addChoices(
              { name: "add", value: "add" },
              { name: "remove", value: "remove" },
              { name: "list", value: "list" }
            )

            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Add/Remove a Role from the Whitelist")
            .setDescriptionLocalizations({
              de: "Füge eine Rolle zur Whitelist hinzu/entferne sie",
            })

            .setRequired(false)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Add/Remove a Channel from the Whitelist")
            .setDescriptionLocalizations({
              de: "Füge einen Kanal zur Whitelist hinzu/entferne ihn",
            })

            .setRequired(false)
        )
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("configure")
        .setDescription("Configure the ChatFilter System")
        .setDescriptionLocalizations({
          de: "Konfiguriere das ChatFilter System",
        })

        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription(
              "Wähle eine Option aus | Füge mehrere Wörter hinzu: word1,word2"
            )
            .setDescriptionLocalizations({
              de: "Wähle eine Option aus | Füge mehrere Wörter hinzu: Wort1,Wort2",
            })

            .addChoices(
              {
                name: "add",
                value: "add",
              },
              {
                name: "remove",
                value: "remove",
              }
            )

            .setRequired(true)
        )

        .addStringOption((option) =>
          option
            .setName("word")
            .setDescription(
              "Set here your Worlds and split it with a , for more."
            )
            .setDescriptionLocalizations({
              de: "Setze hier deine Wörter und trenne sie mit einem , für mehr.",
            })

            .setRequired(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("toggle")
        .setDescription("Toggle CatFilter")
        .setDescriptionLocalizations({
          de: "Schalte CatFilter aus/an",
        })
        .addStringOption((option) =>
          option
            .setName("toggle")
            .setDescription("Toggle CatFilter")
            .setDescriptionLocalizations({
              de: "Schalte CatFilter aus/an",
            })
            .setRequired(true)
            .addChoices(
              {
                name: "✅ Activate the System",
                value: "on",
                name_localizations: { de: "✅ Aktiviere das System" },
              },
              {
                name: "❌ Deactivate the System",
                value: "off",
                name_localizations: { de: "❌ Deaktiviere das System" },
              }
            )
        )
    ),
};
