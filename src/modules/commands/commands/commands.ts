import {ApplicationIntegrationType, InteractionContextType, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits,
    TextDisplayBuilder
} from "discord.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";


export default {
    command: new SlashCommandBuilder()
        .setName("commands")
        .setDescription("Create, Manage, and use the Command Manager!")
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    options: {
        once: false,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageGuild],
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
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setEmoji("<:add:1260157236043583519>")
                .setCustomId("commands-create")
                .setDisabled(true)
                .setLabel("Create Command")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setEmoji("<:setting:1260156922569687071>")
                .setCustomId("commands-manage")
                .setDisabled(true)
                .setLabel("Manage Commands")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setEmoji("<:terminal:1260322426323996783>")
                .setCustomId("commands-manager")
                .setLabel("Open Command Manager (Build-in)")
                .setStyle(ButtonStyle.Secondary),
        );

        await interaction.editReply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [new ContainerBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    [
                        `## ${await convertToEmojiToPng("terminal")} Commands`,
                        `You can create, manage and use the Command Manager`,
                        ``,
                        `**Create Commands** - Create a new Commands.`,
                        `**Manage Commands** - Manage your Commands.`,
                        `**Use Command Manager** - Edit Build-in Command from the Bot. (Not work for all commands!)`,
                        ``,
                    ].join("\n")
                )).addActionRowComponents(row)
            ],
        });
    }
};

