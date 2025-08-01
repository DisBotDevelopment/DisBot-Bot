import { ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default {
    help: {
        name: 'Discord Commands',
        description: 'Setup simple discord settings with command and get extra features to manage your server',
        usage: '/discord',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/discord'
    },
    data: new SlashCommandBuilder()
        .setName("discord")
        .setDescription("Setup simple discord settings with command and get extra features to manage your server")
        .setDescriptionLocalizations({
            de: "Verwalte deinen Discord-Server einfach mit Befehlen und erhalte zusätzliche Funktionen"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts([InteractionContextType.Guild])
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addSubcommand((subCommand) =>
            subCommand
                .setName("nsfw")
                .setDescription("Change NSFW from you channel")
                .setDescriptionLocalizations({
                    de: "Ändere NSFW von deinem Kanal"
                })
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("look-channel")
                .setDescription("Look a channel")
                .setDescriptionLocalizations({
                    de: "Sperre den Kanal"
                })
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role that can't send messages in the channel")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("permission")
                        .setDescription("The permission to set for the role separated by a comma (SendMessages:true/null/false)")
                        .setDescriptionLocalizations({
                            de: "Berechtigung für die Rolle (durch Komma getrennt) (SendMessages:true/null/false)"
                        })
                        .setRequired(false)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("unlook-channel")
                .setDescription("Unlock a channel")
                .setDescriptionLocalizations({
                    de: "Entsperre den Kanal"
                })
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Reset the role and the set permissions value to the slash")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("permission")
                        .setDescription("The permission to set for the role separated by a comma (SendMessages:true/null/false)")
                        .setDescriptionLocalizations({
                            de: "Berechtigung für die Rolle (durch Komma getrennt) (SendMessages:true/null/false)"
                        })
                        .setRequired(false)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("message")
                .setDescription("Simple send a message to a channel")
                .setDescriptionLocalizations({
                    de: "Sende eine Nachricht an einen Kanal"
                })
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("The message to send")
                        .setDescriptionLocalizations({
                            de: "Die Nachricht, die gesendet werden soll"
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("slowmode")
                .setDescription("Change slowmode from you channel")
                .setDescriptionLocalizations({
                    de: "Ändere den langsamen Modus von deinem Kanal"
                })
                .addStringOption((option) =>
                    option
                        .setName("time")
                        .setDescription("Time in seconds (1s 1m 6h)")
                        .setDescriptionLocalizations({
                            de: "Zeit in Sekunden (1s 1m 6h)"
                        })
                        .setRequired(true)
                )
        )
        .addSubcommandGroup((subCommandGroup) =>
            subCommandGroup
                .setName("pause")
                .setDescription("Pause invites or direct messages")
                .setDescriptionLocalizations({
                    de: "Pause Einladungen oder Direktnachrichten"
                })
                .addSubcommand((subCommand) =>
                    subCommand
                        .setName("invites")
                        .setDescription("Pause/Unpause invites from the server")
                        .setDescriptionLocalizations({
                            de: "Pause/Unpause Einladungen vom Server"
                        })
                )
                .addSubcommand((subCommand) =>
                    subCommand
                        .setName("direct-message")
                        .setDescription("Pause/Unpause DMs from the server")
                        .setDescriptionLocalizations({
                            de: "Pause/Unpause DMs vom Server"
                        })
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("only-media")
                .setDescription("Only allow media in the channel")
                .setDescriptionLocalizations({
                    de: "Erlaube nur Medien im Kanal"
                })

                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel to disable only media")
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("no-embed-links")
                .setDescription("Disable embed links in the channel")
                .setDescriptionLocalizations({
                    de: "Deaktiviere eingebettete Links im Kanal"
                })

                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel to enable no embed links")
                        .setRequired(true)
                )
        )
};
