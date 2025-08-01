import {
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ContainerBuilder,
    MessageFlags,
    PermissionFlagsBits,
    SeparatorSpacingSize,
    TextDisplayBuilder
} from "discord.js";
import { PermissionType } from "../../../../enums/permissionType.js";
import { ExtendedClient } from "../../../../types/client.js";
import { convertToEmojiPng } from "../../../../helper/emojis.js";

export default {
    subCommand: "bot.help",
    help: {
        name: "Bot Help",
        description: "Get help about the bot",
        usage: "/bot help",
        examples: ["/bot help"],
        aliases: [],
        docsLink: "https://docs.disbot.app/docs/commands/bot#help",
    },
    options: {
        once: false,
        permission: PermissionType.Bot,
        cooldown: 3000,
        botPermissions: [],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },

    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

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
                `# ${await convertToEmojiPng("disbot", client.user!.id)} **DisBot Help**`
            );
            container.addTextDisplayComponents(title);
            container.addSeparatorComponents(s => s.setSpacing(SeparatorSpacingSize.Large));

            for (const command of pageCommands) {
                const help = command.help;
                const content = `### ${await convertToEmojiPng("bookmarked", client.user!.id)} [${help.name}](${help.docsLink ?? "https://docs.disbot.app"})\n` +
                    `> ${await convertToEmojiPng("paperclip", client.user!.id)} **Description:** ${help.description}\n` +
                    `> ${await convertToEmojiPng("use", client.user!.id)} **Usage:** \`${help.usage}\`\n` +
                    (help.examples.length > 0 ? `> ${await convertToEmojiPng("bookdashed", client.user!.id)} **Example:**\n${help.examples.map(e => `> - ${e}`).join("\n")}` : "") +
                    (help.aliases.length > 0 ? `\n> ${await convertToEmojiPng("filestack", client.user!.id)} **Aliases:**\n ${help.aliases.map(e => `> - ${e}`).join("\n")}` : "");

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
        await interaction.editReply({ components, flags: MessageFlags.IsComponentsV2 });
    }
};
