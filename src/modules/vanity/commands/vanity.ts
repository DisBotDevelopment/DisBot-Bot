import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction, ContainerBuilder,
    EmbedBuilder, InteractionContextType,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {PermissionType} from "../../../enums/permissionType.js";

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
        .setContexts(InteractionContextType.Guild)
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

        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("link")} Vanity`,
                                    ``,
                                    `- Create your own Vanity Url to invite Members`,
                                    `- View Analytics and show your invitations with Invite Logging.`,
                                    `- Manage your Vanity and add them to the  Discovery.`,
                                ].join("\n")
                            )
                    )
                    .addActionRowComponents(
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
                        ))
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
        })

    }
};
