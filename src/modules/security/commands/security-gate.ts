import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {database} from "../../../main/database.js";

export default {
    help: {
        name: 'Security Gate',
        description: 'Manage Security Gate Settings',
        usage: '/security-gate',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/security-gate'
    },
    data: new SlashCommandBuilder()
        .setName("security-gate")
        .setDescription("Manage Security Gate Settings")
        .setDescriptionLocalizations({
            de: "Sicherheitsgate Einstellungen verwalten",
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    options: {
        once: false,
        permission: PermissionType.Security,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageRoles],
        userPermissions: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageRoles],
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
        if (!client.user) throw new Error("User is not logged in.");
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const data = await database.securitys.findFirst
        ({
            where: {
                GuildId: interaction.guildId
            }
        });

        if (!data) await database.securitys.create({
            data: {
                GuildId: interaction.guildId,
            }
        })

        const embed = new EmbedBuilder()
            .setDescription([
                `## ${await convertToEmojiPng("shield", client.user.id)} Security Gate Management`,
                ``,
                `Welcome to the Security Gate Management!`,
                `Current Features from the Security Gate are:`,
                `- **Invite Tracking**: Track invites and their usage`,
                `- **Security Gate**: Enable or disable the security gate feature`,
                `- **Verification**: Verify users before they can interact with the server`,
                ``,
            ].join("\n"))

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("security-gate-invite-tracking")
                .setLabel("Enable Invite Tracking")
                .setEmoji("<:locatefixed:1377009722489573468>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("security-gate-account-age")
                .setLabel("Moderate Suspicious Users")
                .setEmoji("<:shieldquarter:1259432930909098096>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("security-gate-verification")
                .setLabel("Manage Verification")
                .setEmoji("<:bookcheck:1377021742072987719>")
                .setStyle(ButtonStyle.Secondary)
        )

        await interaction.editReply({
            embeds: [embed],
            components: [row]
        })
    }
};
