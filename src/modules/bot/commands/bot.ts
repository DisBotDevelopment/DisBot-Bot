import {AutocompleteInteraction, InteractionContextType, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {PermissionType} from "../../../enums/permissionType.js";

export default {
    help: {
        name: 'Bot',
        description: 'Manage the Bot',
        usage: '/bot',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/bot'
    },
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("Manage the Bot")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("help")
                .setDescription("Use this command to get help about the bot")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("notify")
                .setDescription("Get Notified if the bot is Updated/News")
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("api").setDescription("Create an API Key")
        )
        .addSubcommandGroup((group) =>
            group
                .setName("permissions")
                .setDescription("Manage the Bot Permissions")
                .addSubcommand((subcommand) =>
                    subcommand.setName("list").setDescription("List the Bot Permissions")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("reset")
                        .setDescription("Reset the Bot Permissions from the systems from DisBot")
                        .addStringOption((option) =>
                            option
                                .setName("system")
                                .setDescription("Select the System")
                                .setRequired(true)
                                .setAutocomplete(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set")
                        .setDescription("Set the Bot Permissions")
                        .addStringOption((option) =>
                            option
                                .setName("system")
                                .setDescription("Select the System")
                                .setRequired(true)
                                .setAutocomplete(true)
                        )
                        .addRoleOption((option) =>
                            option
                                .setName("role")
                                .setDescription("Select the Role")
                                .setRequired(true)
                        )
                )
        ),

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();

        const allChoices = Object.values(PermissionType);
        const filtered = allChoices
            .filter(choice =>
                choice.toLowerCase().includes(focusedValue.toLowerCase())
            )
            .slice(0, 25);

        await interaction.respond(
            filtered.map(choice => ({
                name: choice,
                value: choice
            }))
        );
    }
};
