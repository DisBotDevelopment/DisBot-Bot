import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, ContainerBuilder,
    InteractionContextType, MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    help: {
        name: 'Tickets',
        description: 'Manage your ticket components and create new ones',
        usage: '/ticket',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/ticket'
    },
    data: new SlashCommandBuilder()
        .setName("tickets")
        .setDescription(
            "Manage your ticket components and create new ones"
        )
        .setDescriptionLocalizations({
            de: "Verwalte deine Ticket Components und erstelle neue",
        })
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            [`# ${await convertToEmojiPng("ticket", client.user.id)} Tickets`,
                                `> - Manage you tickets and ticket Components`,
                                `> - Create, Manage, Delete Ticket Components`,
                            ].join("\n"))
                    ).addActionRowComponents(
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("ticket-list-guild-tickets")
                            .setLabel("Show Guild Tickets")
                            .setEmoji("<:ticket:1400577766205816852>")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("ticket-add-component")
                            .setLabel("Add a new Ticket Component")
                            .setEmoji("<:puzzle:1381000302601441440>")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("ticket-manage")
                            .setLabel("Manage your Components")
                            .setEmoji("<:setting:1260156922569687071>")
                            .setStyle(ButtonStyle.Secondary),
                    )
                )
            ]
        })

    }
};
