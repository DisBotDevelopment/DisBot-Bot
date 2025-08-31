import {
    ActionRowBuilder, ChannelSelectMenuBuilder,
    ChannelType, ChatInputCommandInteraction,
    ContainerBuilder, MessageFlags, PermissionFlagsBits, RoleResolvable, TextChannel, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {Channel} from "diagnostics_channel";

export default {
    subCommand: "server.channel-link",
    options: {
        once: false,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageWebhooks, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels],
        userPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageChannels],
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
                    .addTextDisplayComponents(new TextDisplayBuilder()
                        .setContent(
                            [
                                `## ${await convertToEmojiPng("cable", client.user.id)} Channel Links`,
                                ``,
                                `- Add channel to link them together to sync messages from this to other servers.`,
                                `- Select what types of messages you want to sync.`,
                                ``,
                            ].join("\n")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId("channellink-channels")
                                .setPlaceholder("Selcet a channel to configure the links.")
                                .setMinValues(1)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                        )
                    )
            ]
        })


    }
};
