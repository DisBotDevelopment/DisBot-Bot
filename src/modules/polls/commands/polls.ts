import {
    ActionRowBuilder,
    ApplicationIntegrationType, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType,
    ChatInputCommandInteraction,
    ContainerBuilder, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

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
        name: 'Polls',
        description: 'Create a Polls/Vote with Discord or DisBot',
        usage: '/polls',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/polls'
    },
    data: new SlashCommandBuilder()
        .setName("polls")
        .setDescription("Create a Polls/Vote with Discord or DisBot")
        .setDescriptionLocalizations({
            de: "Erstelle Polls mit Discord oder DisBot"
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
                                `## ${await convertToEmojiToPng("vote")} Polls`,
                                ``,
                                `- Use Discords Poll Feature to create a Poll.`,
                                `- Create a poll with DisBot like a giveaway!`,
                                ``,
                            ].join("\n")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("polls-discord")
                                .setEmoji("<:discord_cube:1325896195083604080>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Use Discord"),
                            new ButtonBuilder()
                                .setCustomId("polls-disbot")
                                .setEmoji("<:vote:1412727028540506194>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Create a Poll"),
                        )
                    )
            ]
        })


    }
};
