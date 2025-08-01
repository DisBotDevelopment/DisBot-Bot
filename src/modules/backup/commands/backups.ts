import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction, ContainerBuilder,
    EmbedBuilder,
    InteractionContextType,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {PermissionType} from "../../../enums/permissionType.js";

export default {
    help: {
        name: 'Manage Backups',
        description: 'Manage Backups',
        usage: '/backups',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/backups'
    },
    data: new SlashCommandBuilder()
        .setName("backups")
        .setDescription("Manage Backups")
        .setDescriptionLocalizations({
            de: "Backups verwalten",
        })
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    options: {
        once: false,
        permission: PermissionType.Backup,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.Administrator],
        userPermissions: [PermissionFlagsBits.Administrator],
        userHasOnePermission: true,
        isGuildOwner: false,
    },

    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {

        if (!client.user) throw new Error("Client user not found");

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("backup-create")
                .setLabel("Create Backup")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:add:1260157236043583519>"),
            new ButtonBuilder()
                .setCustomId("backup-restore")
                .setLabel("Restore Backup")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:refresh:1260140823106813953>"),
            new ButtonBuilder()
                .setCustomId("backup-manage")
                .setLabel("List Backups")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:reopen:1289668008503148649>"),)

        await interaction.reply({
            components: [

                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent([`## ${await convertToEmojiPng("package", client.user.id)} Backups`,
                        ``,
                        `> Create and and setup backups of the server.`,
                        `> Load and restore backups of the server.`,
                        `> Delete backups of the server.`,
                        ``,].join("\n"))
                ).addActionRowComponents(row)

            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
        });
    }
};
