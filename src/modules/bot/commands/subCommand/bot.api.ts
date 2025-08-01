import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits,
} from "discord.js";
import { ExtendedClient } from "../../../../types/client.js";
import { convertToEmojiPng } from "../../../../helper/emojis.js";
import { PermissionType } from "../../../../enums/permissionType.js";
import { database } from "../../../../main/database.js";

export default {
    options: {
        once: false,
        permission: PermissionType.Bot,
        cooldown: 3000,
        botPermissions: [],
        userPermissions: [PermissionFlagsBits.Administrator],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    subCommand: "bot.api",
    help: {
        name: "Bot API",
        description: "Manage you API Settings from DisBot API Service",
        usage: "/bot api",
        examples: ["/bot api"],
        aliases: [],
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
        if (!client.user) throw new Error("Client user not found");


        const data = await database.apis.findFirst({
            where: {
                UserId: interaction.user.id,
            }
        });

        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setDescription([
                `## ${await convertToEmojiPng("route", client.user.id)} DisBot API Service`,
                ``,
                `${await convertToEmojiPng("key", client.user.id)} **API Key**: \`${data?.Key}\``,
                `${await convertToEmojiPng("flag", client.user.id)} **API Flags**: ${data?.Flags.toString()}`,
                `${await convertToEmojiPng("cuboid", client.user.id)} **Whitelisted Guilds**: ${data?.Guilds.toString()}`,
            ].join("\n"))

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("api-create")
                .setEmoji("<:add:1260157236043583519>")
                .setLabel("Regenerate API Key")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("api-guild")
                .setEmoji("<:brackets:1362058401240060095>")
                .setLabel("Whitelist/Unwhitelist Guild")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("api-refresh")
                .setEmoji("\<:refresh:1260140823106813953>")
                .setStyle(ButtonStyle.Secondary),
        )

        interaction.editReply({
            embeds: [embed],
            components: [row],
        });
    },
};
