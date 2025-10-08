import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, ContainerBuilder,
    MessageFlags,
    PermissionFlagsBits,
    RoleResolvable,
    TextChannel, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";

export default {
    subCommand: "utility.export",
    options: {
        once: false,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages],
        userPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels],
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
                            .setContent(`## ${await convertToEmojiPng("export", client.user.id)} Export your UserData or GuildData from this guild or your Account!`)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setEmoji("<:export:1321939859228721172>")
                                .setLabel("Export User Data")
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId("utility-export-user"),
                            new ButtonBuilder()
                                .setEmoji("<:export:1321939859228721172>")
                                .setLabel("Export Guild Data")
                                .setDisabled(!(interaction.guild.ownerId == interaction.user.id))
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId("utility-export-guild"),
                            new ButtonBuilder()
                                .setEmoji("<:export:1321939859228721172>")
                                .setLabel("Delete Guild Data (SOON)")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Danger)
                                .setCustomId("utility-export-guild-delete"),
                        )
                    )
            ]
        })


    }
};
