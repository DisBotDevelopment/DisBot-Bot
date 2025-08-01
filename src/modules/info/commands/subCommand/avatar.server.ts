import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits
} from "discord.js";
import { ExtendedClient } from "../../../../types/client.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
    options: {
        once: false,
        permission: PermissionType.Info,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageGuild],
        userPermissions: [PermissionFlagsBits.UseApplicationCommands],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    subCommand: "avatar.server",
    help: {
        name: "Server Avatar",
        description: "Get the Server avatar in different formats",
        usage: "/avatar server",
        examples: ["/avatar server"],
        aliases: [],
        docsLink: "https://docs.disbot.app/docs/commands/avatar#server",
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

        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");

        const { guild, options, member } = interaction;
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("PNG")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    interaction.guild.iconURL({ extension: "png", size: 512 }) as string
                ),

            new ButtonBuilder()
                .setLabel("JPEG")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    interaction.guild.iconURL({ extension: "jpeg", size: 512 }) as string
                ),
            new ButtonBuilder()
                .setLabel("JPG")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    interaction.guild.iconURL({ extension: "jpg", size: 512 }) as string
                ),
            new ButtonBuilder()
                .setLabel("GIF")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    interaction.guild.iconURL({
                        extension: "gif",
                        size: 512
                    }) as string
                ),
            new ButtonBuilder()
                .setLabel("WEBP")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    interaction.guild.iconURL({ extension: "webp", size: 512 }) as string
                )
        );

        return interaction.editReply({
            components: [row],

            embeds: [
                new EmbedBuilder()
                    .setColor("#2B2D31")
                    .setDescription(`Server Icon of ${guild.name}`)
                    .setFooter({
                        text: interaction.guild.name,
                        iconURL: interaction.guild.iconURL({}) ?? undefined
                    })
                    .setImage(
                        `${interaction.guild.iconURL({
                            extension: "png",
                            forceStatic: true,
                            size: 512
                        })}`
                    )
                    .setTimestamp()
            ],
        });
    }
};
