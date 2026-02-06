import {
    ApplicationIntegrationType,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ContainerBuilder, InteractionContextType,
    MessageFlags,
    PermissionFlagsBits, PermissionsBitField,
    SeparatorSpacingSize, SlashCommandBuilder,
    TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    help: {
        name: 'Help',
        description: 'Use this command to get help about the bot',
        usage: '/help',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/help'
    },
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Use this command to get help about the bot")
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");

        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const allCommands = [
            ...(client.commands?.values() ?? []),
            ...(client.subCommands?.values() ?? [])
        ].filter(cmd => !!cmd.help)

        const perPage = 5;

        const buildPage = async (page: number) => {
            const totalPages = Math.ceil(allCommands.length / perPage);
            const container = new ContainerBuilder();

            const start = page * perPage;
            const pageCommands = allCommands.slice(start, start + perPage);

            const title = new TextDisplayBuilder().setContent(
                `# ${await convertToEmojiToPng("disbot")} **DisBot Help**`
            );
            container.addTextDisplayComponents(title);
            container.addSeparatorComponents(s => s.setSpacing(SeparatorSpacingSize.Large));

            for (const command of pageCommands) {
                const help = command.help;
                const content = `### ${await convertToEmojiToPng("bookmarked")} [${help.name}](${help.docsLink ?? "https://docs.disbot.app"})\n` +
                    `> ${await convertToEmojiToPng("paperclip")} **Description:** ${help.description}\n` +
                    `> ${await convertToEmojiToPng("use")} **Usage:** \`${help.usage}\`\n` +
                    (help.examples.length > 0 ? `> ${await convertToEmojiToPng("bookdashed")} **Example:**\n${help.examples.map(e => `> - ${e}`).join("\n")}` : "") +
                    (help.aliases.length > 0 ? `\n> ${await convertToEmojiToPng("filestack")} **Aliases:**\n ${help.aliases.map(e => `> - ${e}`).join("\n")}` : "");

                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(content));
                container.addSeparatorComponents(s => s.setSpacing(SeparatorSpacingSize.Small));
            }

            container.addSeparatorComponents(s => s.setSpacing(SeparatorSpacingSize.Large));

            const prevButton = new ButtonBuilder()
                .setCustomId(`bot-help-page:${page - 1}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:arrowbackregular24:1301119279088799815>")
                .setDisabled(page <= 0);

            const nextButton = new ButtonBuilder()
                .setCustomId(`bot-help-page:${page + 1}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:next:1287457822526935090>")
                .setDisabled(page + 1 >= totalPages);

            container.addActionRowComponents(row => row.addComponents(prevButton, nextButton));

            return container;
        };

        const components = [await buildPage(0)];
        await interaction.editReply({components, flags: MessageFlags.IsComponentsV2});
    }
};
