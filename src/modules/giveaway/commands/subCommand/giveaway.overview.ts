import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, ContainerBuilder,
    MessageFlags,
    PermissionFlagsBits, TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiToPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";

export default {
    subCommand: "giveaway.overview",
    options: {
        once: false,
        permission: PermissionType.Giveaway,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageRoles],
        userPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageRoles],
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


        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("giveaway-list")
                .setEmoji("<:giveaway:1366020996934668419>")
                .setStyle(ButtonStyle.Secondary)
        );

        if (!client.user) return;
        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("giveaway")} `,
                                    ``,
                                    `- Create your onw Giveaways with the Commands your see.`,
                                    `- Manage the giveaways with the commands from /giveaway.`,
                                    `- If you lose the overview use the list button below.`,
                                    `- More Features will follow!`,
                                    ``
                                ].join("\n"))
                    )
                    .addActionRowComponents(row)
            ]
        });


    }
};
