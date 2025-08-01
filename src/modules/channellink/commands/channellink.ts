import {InteractionContextType, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";

export default {
    help: {
        name: 'Channel Link',
        description: 'Sync Channels with other Channels',
        usage: '/channellink',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/channellink'
    },
    data: new SlashCommandBuilder()
        .setName("channellink")
        .setContexts(InteractionContextType.Guild)
        .setDescription("Sync Channels with other Channels")
        .setDescriptionLocalizations({
            de: "Sync Channels mit anderen Channels"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)

        .addSubcommand((subCommand) =>
            subCommand
                .setName("add")
                .setDescription("Add a Channel")
                .setDescriptionLocalizations({
                    de: "Füge einen Channel hinzu."
                })

                .addChannelOption((option) =>
                    option

                        .setName("channel")
                        .setDescription("Add a Channel from the Server")
                        .setDescriptionLocalizations({
                            de: "Füge einen Channel hinzu von dem Server"
                        })
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option

                        .setName("webhook-url")
                        .setDescription(
                            "[NOT DELETE THIS WEBHOOK] Create the webhook in the channel where your messages will be sent."
                        )
                        .setDescriptionLocalizations({
                            de: "[NICHT LÖSCHEN] Erstelle den Webhook im Channel vom Channel"
                        })
                        .setRequired(true)
                )
        )

        .addSubcommand((subCommand) =>
            subCommand
                .setName("remove")
                .setDescription("Remove a Channel")
                .setDescriptionLocalizations({
                    de: "Entferne einen Channel"
                })

                .addChannelOption((option) =>
                    option

                        .setName("channel")
                        .setDescription("Remove a Channel")
                        .setDescriptionLocalizations({
                            de: "Entferne einen Channel"
                        })
                        .setRequired(true)
                )
        )

        .addSubcommand((subCommand) =>
            subCommand
                .setName("list")
                .setDescription("List all Channels")
                .setDescriptionLocalizations({
                    de: "Liste alle Channels auf"
                })

                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The Channel you want to get a list")
                        .setDescriptionLocalizations({
                            de: "Der Channel von dem du eine Liste haben möchtest"
                        })
                )
        )

        .addSubcommand((subCommand) =>
            subCommand
                .setName("toggle")
                .setDescription("Toggle Connection")
                .setDescriptionLocalizations({
                    de: "Schalte Connection aus/an"
                })
                .addStringOption((option) =>
                    option
                        .setName("toggle")
                        .setDescription("Toggle Connection")
                        .setDescriptionLocalizations({
                            de: "Schalte Connection aus/an"
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

    //Das ist unsere Methode, wo wir unsere Interaction abfangen, diese ist async
};
