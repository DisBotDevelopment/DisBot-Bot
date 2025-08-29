import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction, ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder, TextDisplayBuilder, UserSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {PermissionType} from "../../../enums/permissionType.js";

export default {
    help: {
        name: 'Permissions',
        description: 'Permissions Settings from Interactions',
        usage: '/permissions',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/permissions'
    },
    data: new SlashCommandBuilder()
        .setName("permissions")
        .setDescription("Permissions Settings from Interactions")
        .setDescriptionLocalizations({
            de: "Permissions Einstellungen von Interactions",
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    options: {
        once: false,
        permission: PermissionType.ReactionRoles,
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
        if (!client.user) throw new Error("Client User is not defined");


        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiPng("permission", client.user.id)} Permissions`,
                                    ``,
                                    `- Click the buttons below to manage permissions from a Button base on the CustomId or Name!`,
                                    `- Manage Permission related setting for every command, button, modal and selectmenu.`,
                                    ``,
                                    `-# Note: This are only Permissions not settings `
                                ].join("\n"))
                    )
                    .addActionRowComponents(
                     new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                         new UserSelectMenuBuilder()
                             .setCustomId("permissions-view-user-permissions")
                             .setPlaceholder("Select a user to view the Permissions")
                             .setMaxValues(1)
                     )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("permissions-buttons")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Buttons")
                                .setEmoji("<:button:1327305176553492520>"),
                            new ButtonBuilder()
                                .setCustomId("permissions-selectmenu")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Selectmenu")
                                .setEmoji("<:selectmenu:1327304700701315132>"),
                            new ButtonBuilder()
                                .setCustomId("permissions-modals")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Modals")
                                .setEmoji("<:renamesolid24:1259433901554929675>")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("permissions-commands")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Commands")
                                .setEmoji("<:terminal:1260322426323996783>"),
                            new ButtonBuilder()
                                .setCustomId("permissions-subcommands")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Sub Commands")
                                .setEmoji("<:terminal:1260322426323996783>"),
                            new ButtonBuilder()
                                .setCustomId("permissions-subcommandgroups")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Sub Commands Groups")
                                .setEmoji("<:terminal:1260322426323996783>"),
                        )
                    )

            ]
        })

    }
};
