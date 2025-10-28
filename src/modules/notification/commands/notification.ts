import {
    ActionRowBuilder,
    ChannelType, ChatInputCommandInteraction,
    CommandInteraction, ContainerBuilder,
    InteractionContextType, MessageFlags,
    PermissionsBitField,
    SlashCommandBuilder, StringSelectMenuBuilder, TextDisplayBuilder,
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    help: {
        name: 'Notification',
        description: 'Setup a notification for some Social Media Platforms',
        usage: '/notification',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/notification'
    },
    data: new SlashCommandBuilder()
        .setName("notification")
        .setContexts(InteractionContextType.Guild)
        .setDescription("Setup a notification for some Social Media Platforms")
        .setDescriptionLocalizations({
            de: "Richte eine Benachrichtigung für einige Social Media Plattformen ein",
        })
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
    async execute(interaction: ChatInputCommandInteraction) {

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("bellring")} Notifications`,
                                    ``,
                                    `- **Select on of the following Notification Options.**`,
                                    `- **Twitch**, **Youtube**, **Spotify**, **TikTok(SOON)**`,
                                    ``
                                ].join("\n")
                            )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("notification-select")
                                .setPlaceholder("Select a Notification Option")
                                .addOptions(
                                    [
                                        {
                                            label: "Twitch Notification",
                                            description: "Manage Twitch Notification",
                                            emoji: "<:s_twitch02:1432486211611787385>",
                                            value: "twitch"
                                        },
                                        {
                                            label: "Youtube Notification",
                                            description: "Manage Youtube Notification",
                                            emoji: "<:youtube:1432486146868510720>",
                                            value: "youtube"
                                        },
                                        {
                                            label: "Spotify Notification",
                                            description: "Manage Spotify Notification",
                                            emoji: "<:spotify:1365769492734676994>",
                                            value: "spotify"
                                        },
                                        {
                                            label: "TikTok Notification",
                                            description: "Manage TikTok Notification",
                                            emoji: "<:tiktok:1432486783442227220>",
                                            value: "tiktok"
                                        }
                                    ]
                                )
                        )
                    )
            ]
        })

    }
};
