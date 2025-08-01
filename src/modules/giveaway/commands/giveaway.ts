import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";


export default {
  help: {
    name: 'Giveaway',
    description: 'Make a give a way',
    usage: '/giveaway',
    examples: [],
    aliases: [],
    docsLink: 'https://docs.disbot.app/docs/commands/giveaway'
  },
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Make a give a way")
    .setContexts(InteractionContextType.Guild)
    .setDescriptionLocalizations({ de: "Erstelle ein giveaway" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subCommand) =>
      subCommand
        .setName("delete")
        .setDescription("Delete a giveaway")
        .setDescriptionLocalizations({
          de: "Lösche ein Giveaway"
        })

        .addStringOption((option) =>
          option
            .setName("message-url")
            .setDescription("The message url of the giveaway")
            .setDescriptionLocalizations({
              de: "Die Nachrichten URL des Giveaways"
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("setup")
        .setDescription("Setup a giveaway - SOON")
        .setDescriptionLocalizations({
          de: "Richte ein Giveaway ein - BALD"
        })
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("create")
        .setDescription("Create a giveaway")
        .setDescriptionLocalizations({
          de: "Erstelle ein Giveaway"
        })
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("reroll")
        .setDescription("Role the winner again")
        .setDescriptionLocalizations({
          de: "Würfle den Gewinner erneut aus"
        })

        .addStringOption((option) =>
          option
            .setName("message-url")
            .setDescription("The message url of the giveaway")
            .setDescriptionLocalizations({
              de: "Die Nachrichten URL des Giveaways"
            })
            .setRequired(true)
        )
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("list")
        .setDescription("List all giveaways")
        .setDescriptionLocalizations({
          de: "Liste alle Giveaways auf"
        })
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("end")
        .setDescription("End a giveaway")
        .setDescriptionLocalizations({
          de: "Beende ein Giveaway"
        })
        .addStringOption((option) =>
          option
            .setName("message-url")
            .setDescription("The message url of the giveaway")
            .setDescriptionLocalizations({
              de: "Die Nachrichten URL des Giveaways"
            })
            .setRequired(true)
        )
    )

    .addSubcommand((subCommand) =>
      subCommand
        .setName("start")
        .setDescription("Start a giveaway with a default message")
        .setDescriptionLocalizations({
          de: "Starte ein Giveaway mit einer Standardnachricht"
        })
        .addStringOption((option) =>
          option
            .setName("message-url")
            .setDescription("The message url of the giveaway")
            .setDescriptionLocalizations({
              de: "Die Nachrichten URL des Giveaways"
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("pause")
        .setDescription("Pause a giveaway")
        .setDescriptionLocalizations({
          de: "Pause ein Giveaway"
        })
        .addStringOption((option) =>
          option
            .setName("message-url")
            .setDescription("The message url of the giveaway")
            .setDescriptionLocalizations({
              de: "Die Nachrichten URL des Giveaways"
            })
            .setRequired(true)
        )
    )

  //Das ist unsere Methode, wo wir unsere Interaction abfangen, diese ist async
};
