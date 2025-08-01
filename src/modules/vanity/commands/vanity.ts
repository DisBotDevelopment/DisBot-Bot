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
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { PermissionType } from "../../../enums/permissionType.js";

export default {
    help: {
        name: 'Vanity Management',
        description: 'Manage Vanity URLs',
        usage: '/vanity',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/vanity'
    },
    data: new SlashCommandBuilder()
        .setName("vanity")
        .setDescription("Manage Vanity URLs")
        .setDescriptionLocalizations({
            de: "Verwalte Vanity URLs",
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    options: {
        once: false,
        permission: PermissionType.Vanity,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageGuild],
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
        if (!client.user) throw new Error("Client is not ready");
        const embed = new EmbedBuilder()
            .setDescription("ss")

        interaction.reply({
            embeds: [
                embed
                    .setColor("#2B2D31")
                    .setDescription(
                        `## ${await convertToEmojiPng("link", client.user.id)} Manage your vanity URL's`
                    )
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel("Create Vanity URL")
                        .setCustomId(`vanity-create`)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("<:add:1260157236043583519>"),
                    new ButtonBuilder()
                        .setLabel("Manage Vanity URL's")
                        .setCustomId(`vanity-manage`)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("<:setting:1260156922569687071>"),
                )
            ],
            flags: MessageFlags.Ephemeral
        })

    }
};
