import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    MessageFlags,
    PermissionFlagsBits
} from "discord.js";
import { DisbotInteractionType } from "../../../../enums/disbotInteractionType.js";
import { PermissionType } from "../../../../enums/permissionType.js";
import { ExtendedClient } from "../../../../types/client.js";

export default {
    subCommand: "avatar.user",
    permission: PermissionType.Other,
    options: {
        once: false,
        permission: PermissionType.Info,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageGuild],
        userPermissions: [PermissionFlagsBits.UseApplicationCommands],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    help: {
        name: "User Avatar",
        description: "Get the User avatar in different formats (and from other users)",
        usage: "/avatar user",
        examples: ["/avatar user"],
        aliases: [],
        docsLink: "https://docs.disbot.app/docs/commands/avatar#user",
    },
    type: DisbotInteractionType.SubCommand,

    /**
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

        const getMember =
            (options.getMember("member") as GuildMember) || (member as GuildMember);

        const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("Server Avatar")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("av_serverAvatar")
        );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("PNG")
                .setStyle(ButtonStyle.Link)
                .setURL(getMember.displayAvatarURL({ extension: "png", size: 512 })),

            new ButtonBuilder()
                .setLabel("JPEG")
                .setStyle(ButtonStyle.Link)
                .setURL(getMember.displayAvatarURL({ extension: "jpeg", size: 512 })),
            new ButtonBuilder()
                .setLabel("JPG")
                .setStyle(ButtonStyle.Link)
                .setURL(getMember.displayAvatarURL({ extension: "jpg", size: 512 })),
            new ButtonBuilder()
                .setLabel("GIF")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    getMember.displayAvatarURL({
                        extension: "gif",
                        size: 512
                    })
                ),
            new ButtonBuilder()
                .setLabel("WEBP")
                .setStyle(ButtonStyle.Link)
                .setURL(getMember.displayAvatarURL({ extension: "webp", size: 512 }))
        );

        return interaction.editReply({
            components: [row1, row],

            embeds: [
                new EmbedBuilder()
                    .setColor("#2B2D31")
                    .setDescription(`${getMember.user ? getMember.user : "Your"} Avatar`)
                    .setFooter({
                        text: getMember.id,
                        iconURL: getMember.displayAvatarURL()
                    })
                    .setImage(
                        `${getMember.displayAvatarURL({
                            extension: "png",
                            forceStatic: true,
                            size: 512
                        })}`
                    )
                    .setTimestamp()
            ]
        });
    }
};
