import {
    ActionRowBuilder,
    ApplicationIntegrationType, ChannelSelectMenuBuilder, ChannelType,
    ChatInputCommandInteraction,
    ContainerBuilder, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    options: {
        once: false,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageWebhooks, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels],
        userPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageChannels],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    help: {
        name: 'Channel Link Commands',
        description: 'Channel Link to link channel over servers',
        usage: '/channel-link',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/channel-link'
    },
    data: new SlashCommandBuilder()
        .setName("channel-link")
        .setDescription("Channel Link to link channel over servers'")
        .setDescriptionLocalizations({
            de: "Kanalverbindung zum Verbinden von Kanälen über Server"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts([InteractionContextType.Guild])
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
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
