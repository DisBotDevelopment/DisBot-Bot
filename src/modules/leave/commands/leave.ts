import {
    ActionRowBuilder, ApplicationIntegrationType, ButtonBuilder, ButtonStyle,
    ChannelType, ChatInputCommandInteraction,
    CommandInteraction, ContainerBuilder,
    InteractionContextType, MessageFlags,
    PermissionsBitField,
    SlashCommandBuilder, TextDisplayBuilder
} from "discord.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    help: {
        name: 'Leave',
        description: 'Leave Steup',
        usage: '/leave',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/leave'
    },
    command: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave Module")
        .setDescriptionLocalizations({de: "Leave Module"})
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

    async execute(interaction: ChatInputCommandInteraction) {

        const toggle = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        })

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("eyeclosed")} Leave`,
                                    ``,
                                    `- **Toggled**: ${toggle?.LeaveEnabled ? `${await convertToEmojiToPng("toggleon")} (On)` : `${await convertToEmojiToPng("toggleoff")} (Off)`}`,
                                    ``,
                                    `- Use a Components V2 Message or an Embed.`,
                                    `- Generate a Custom Image with your Style for the Message`,
                                    `- Toggle the Leave Module everytime on or off.`,
                                    ``
                                ].join("\n")
                            )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("leave-channel")
                                .setLabel("Set a leave Channel")
                                .setEmoji("<:addchannel:1324458759589728387>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("leave-message")
                                .setLabel("Set a Message Template")
                                .setEmoji("<:message:1322252985702551767>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("leave-image")
                                .setLabel("Create an Leave Image")
                                .setEmoji("<:imageadd:1260148502449754112>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("leave-toggle")
                                .setLabel((toggle?.LeaveEnabled ? "Disable" : "Enable") + " Module")
                                .setEmoji(toggle?.LeaveEnabled ? "<:toggleoff:1301864526848987196>" : "<:toggleon:1301864515838672908>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
            ]
        })

    }
};
