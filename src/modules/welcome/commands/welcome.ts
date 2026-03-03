import {
    ActionRowBuilder, ApplicationIntegrationType,
    ButtonBuilder, ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    CommandInteraction, ContainerBuilder, InteractionContextType, MessageFlags,
    PermissionsBitField,
    SlashCommandBuilder, TextDisplayBuilder
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {DatabaseSync} from "node:sqlite";
import {database} from "../../../main/database.js";

export default {
    help: {
        name: 'Welcome',
        description: 'Welcome Steup',
        usage: '/welcome',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/welcome'
    },
    command: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Welcome Module")
        .setDescriptionLocalizations({de: "Willkommen Module"})
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setContexts(InteractionContextType.Guild)
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
                                    `## ${await convertToEmojiToPng("hand")} Welcome`,
                                    ``,
                                    `- **Toggled**: ${toggle?.WecomeEnabled ? `${await convertToEmojiToPng("toggleon")} (On)` : `${await convertToEmojiToPng("toggleoff")} (Off)`}`,
                                    ``,
                                    `- Use a Components V2 Message or an Embed.`,
                                    `- Generate a Custom Image with your Style for the Message`,
                                    `- Toggle the Welcome Module everytime on or off.`,
                                    ``
                                ].join("\n")
                            )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("welcome-channel")
                                .setLabel("Set a Welcome Channel")
                                .setEmoji("<:addchannel:1324458759589728387>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("welcome-message")
                                .setLabel("Set a Message Template")
                                .setEmoji("<:message:1322252985702551767>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("welcome-image")
                                .setLabel("Create an Welcome Image")
                                .setEmoji("<:imageadd:1260148502449754112>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("welcome-toggle")
                                .setLabel((toggle.WecomeEnabled ? "Disable" : "Enable") + " Module")
                                .setEmoji(toggle.WecomeEnabled ? "<:toggleoff:1301864526848987196>" : "<:toggleon:1301864515838672908>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
            ]
        })

    }

};
