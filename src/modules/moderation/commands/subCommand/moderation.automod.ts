import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ChatInputCommandInteraction, ContainerBuilder, MessageFlags,
    PermissionFlagsBits, TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";

export default {
    subCommand: "moderation.automod",
    options: {
        once: false,
        permission: PermissionType.Moderation,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.KickMembers],
        userPermissions: [PermissionFlagsBits.KickMembers],
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

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiPng("automod", client.user.id)} Automod`,
                                    ``,
                                    `- Automoderate your server to be save!`,
                                    `- Use Discord automod to do extra actions and moderate members`,
                                    `- Moderate members messages and have an overview`,
                                ].join("\n")))
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("moderation-automod-ai")
                                .setLabel("AI Moderation (SOON)")
                                .setEmoji("<:sparkles:1413510817688584252>")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("moderation-automod-discord")
                                .setLabel("Discord AutoMod (SOON)")
                                .setEmoji("<:automod:1413505855638208637>")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("moderation-automod-disbot")
                                .setLabel("DisBot AutoMod")
                                .setEmoji("<:mod:1413504102947618928>")
                                .setDisabled(false)
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )

            ]
        })
    },
};
