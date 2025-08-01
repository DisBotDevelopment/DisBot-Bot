import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default {
    help: {
        name: 'Avatar',
        description: 'Show your or a Member Avatar',
        usage: '/avatar',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/avatar'
    },
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .setDescription("Show your or a Member Avatar")
        .setDescriptionLocalizations({
            de: "Zeige dein oder ein Mitglieder Avatar",
        })
        .setContexts(InteractionContextType.Guild)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("server")
                .setDescription("Show the Server Avatar")
                .setDescriptionLocalizations({ de: "Zeige das Server Avatar" })
        )

        .addSubcommand((subcommand) =>
            subcommand
                .setName("user")
                .setNameLocalizations({ de: "nutzer" })
                .setDescription("Show the User Avatar")
                .setDescriptionLocalizations({ de: "Zeige den Nutzer Avatar" })
                .addUserOption((options) =>
                    options
                        .setName("member")
                        .setNameLocalizations({ de: "mitglied" })
                        .setDescription("member")
                        .setDescriptionLocalizations({ de: "Mitglied" })

                        .setRequired(false)
                )
        ),
};
