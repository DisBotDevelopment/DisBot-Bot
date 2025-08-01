import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction, ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";

export default {
    subCommand: "bot.notify",
    help: {
        name: "Bot Notify",
        description: "Get Updates for important Bot News from the Support Server",
        usage: "/bot notify",
        examples: ["/bot notify"],
        aliases: [],
        docsLink: "https://docs.disbot.app/docs/commands/bot#notify",
    }, options: {
        once: false,
        permission: PermissionType.Bot,
        cooldown: 3000,
        botPermissions: [],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        if (!client.user) throw new Error("Client User is not defined")

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("bot-notify-all")
                .setLabel("All")
                .setEmoji("<:paperclip:1326158889779069029>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("bot-notify-updates")
                .setLabel("Updates")
                .setEmoji("<:news:1326158887765676083>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("bot-notify-status")
                .setLabel("Status")
                .setEmoji("<:barrier:1326158893683838997>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("bot-notify-announcments")
                .setLabel("Announcments")
                .setEmoji("<:megaphone:1326158885517525126>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("bot-notify-customer")
                .setLabel("DisBot Ultra")
                .setEmoji("<:logo:1379836032505348296>")
                .setStyle(ButtonStyle.Secondary)
        );

        interaction.editReply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        [
                            `## ${await convertToEmojiPng("news", client.user.id)} DisBot News`,
                            ``,
                            `> Welcome to the DisBot News. Here you will find all the latest news about DisBot.`,
                            ` **Get Notified, if the bot is Updated or a Status Update is available.**`,
                            ` **You can also get Notified about new Features or Bug Fixes.**`,
                            ``,
                            `Use the Buttons to Select you Notification Preferences.`,
                            `- **Options**:`,
                            `  - ${await convertToEmojiPng("paperclip", client.user.id)} **All**: Get Notified about all Updates and News.`,
                            `  - ${await convertToEmojiPng("news", client.user.id)} **Updates**: Get Notified about Major Updates and News.`,
                            `  - ${await convertToEmojiPng("barrier", client.user.id)} **Status**: Get Notified about Minor Updates and News.`,
                            `  - ${await convertToEmojiPng("megaphone", client.user.id)} **Announcments**: Get Notified about Patch Updates and News.`,
                            `  - ${await convertToEmojiPng("disbotultra", client.user.id)} **Ultra**: Get Notified about all DisBot Ultra Updates.(https://disbot.app/ultra)`,
                            `-# **Note**: You can change your Preferences at any time.`
                        ].join("\n"))
                ).addActionRowComponents(row)
            ]
        })
    }
}
