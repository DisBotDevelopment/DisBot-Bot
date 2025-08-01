import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits,
    TextChannel
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import {randomUUID} from "crypto";

export default {
    subCommand: "tempvoice.setup", options: {
        once: false,
        permission: PermissionType.TempVoice,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
        userPermissions: [PermissionFlagsBits.ManageGuild],
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
        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");


        const channel = interaction.options.getChannel("channel");
        const category = interaction.options.getChannel("category");
        const managechannel = interaction.options.getChannel("manage-channel");
        const manage = interaction.options.getString("use-external-manage-channel");
        const getLimit = interaction.options.getInteger("preset-limit") || null;
        const getName = interaction.options.getString("preset-name") || null;

        (
            await database.tempVoices.findMany({where: {GuildId: interaction.guild.id}})
        ).forEach(async (data) => {
            if (channel?.id == data.JointoCreateChannel) {
                if (!client.user) throw new Error("Client user not found");
                return interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} This Channel is already a TempVC channel!`
                });
            }
        });
        switch (manage) {
            case "no": {
                (
                    await database.tempVoices.findMany({where: {GuildId: interaction.guild.id}})
                ).forEach(async (data) => {
                    if (channel?.id == data.JointoCreateChannel) {
                        if (!client.user) throw new Error("Client user not found");
                        return interaction.editReply({
                            content: `## ${await convertToEmojiPng(
                                "error",
                                client.user.id
                            )} This Channel is already a TempVC channel!`
                        });
                    }
                });

                await database.tempVoices.create({
                    data: {
                        GuildId: interaction.guild.id,
                        JointoCreateChannel: channel?.id,
                        JointoCreateCategory: category?.id,
                        Manage: false,
                        PresetLimit: getLimit,
                        Name: getName,
                        UUID: randomUUID(),
                    }
                });

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Join To Create Setup`)
                            .setColor("#2B2D31")
                            .setDescription(
                                [
                                    `> **Channel:** <#${channel?.id}>`,
                                    `> **Channel ID:** \`${channel?.id}\``,
                                    `> **Category:** <#${category?.id}>`,
                                    `> **Category ID:** \`${category?.id}\``,
                                    `> **External Manage Channel:** \`${manage}\``,
                                    `> **Preset Limit:** \`${getLimit}\``
                                ].join("\n")
                            )
                            .setTimestamp()
                    ]
                });
            }

                break;

            case "yes": {
                (
                    await database.tempVoices.findMany({where: {GuildId: interaction.guild.id}})
                ).forEach(async (data) => {
                    if (channel?.id == data.JointoCreateChannel) {
                        if (!client.user) throw new Error("Client user not found");
                        return interaction.editReply({
                            content: `## ${await convertToEmojiPng(
                                "error",
                                client.user.id
                            )} This Channel is already a TempVC channel!`
                        });
                    }
                });

                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("join_rename")
                        .setEmoji("<:renamesolid24:1259433901554929675>")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("join_limit")
                        .setEmoji("<:user:1259432940383768647>")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("join_privcy")
                        .setEmoji("<:shieldquarter:1259432930909098096>")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("join_trust")
                        .setEmoji("<:usercheck:1259432938890727446>")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("join_untrust")
                        .setEmoji("<:userx:1259432937087172659>")
                        .setStyle(ButtonStyle.Secondary)
                );

                const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("join_kick")
                        .setEmoji("<:uservoice:1259432935157792840>")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("join_region")
                        .setEmoji("<:globe:1259432929453674506>")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("join_transfer")
                        .setEmoji("<:crown:1259432933886791681>")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("join_delete")
                        .setEmoji("<:trash:1259432932234367069>")
                        .setStyle(ButtonStyle.Secondary)
                );

                await database.tempVoices.create({
                    data: {
                        GuildId: interaction.guild.id,
                        JointoCreateChannel: channel?.id,
                        JointoCreateCategory: category?.id,
                        Manage: false,
                        PresetLimit: getLimit,
                        Name: getName,
                        UUID: randomUUID(),
                    }
                });

                let renamesolid24;
                await convertToEmojiPng("renamesolid24", client.user.id).then(
                    (emoji: any) => {
                        renamesolid24 = emoji;
                    }
                );
                let user;
                await convertToEmojiPng("user", client.user.id).then((emoji: any) => {
                    user = emoji;
                });
                let shieldquarter;
                await convertToEmojiPng("shieldquarter", client.user.id).then(
                    (emoji: any) => {
                        shieldquarter = emoji;
                    }
                );
                let usercheck;
                await convertToEmojiPng("usercheck", client.user.id).then(
                    (emoji: any) => {
                        usercheck = emoji;
                    }
                );
                let userx;
                await convertToEmojiPng("userx", client.user.id).then(
                    (emoji: any) => {
                        userx = emoji;
                    }
                );
                let uservoice;
                await convertToEmojiPng("uservoice", client.user.id).then(
                    (emoji: any) => {
                        uservoice = emoji;
                    }
                );
                let globe;
                await convertToEmojiPng("globe", client.user.id).then(
                    (emoji: any) => {
                        globe = emoji;
                    }
                );
                let crown;
                await convertToEmojiPng("crown", client.user.id).then(
                    (emoji: any) => {
                        crown = emoji;
                    }
                );
                let trash;
                await convertToEmojiPng("trash", client.user.id).then(
                    (emoji: any) => {
                        trash = emoji;
                    }
                );

                (managechannel as TextChannel).send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Manage Your Channel`)
                            .setColor("#2B2D31")
                            // .setImage("https://i.ibb.co/HT0Wsfr/disbotsvcimage.png")
                            .setDescription(
                                [
                                    `### Click on the buttons to manage your channel`,
                                    ``,
                                    ``,
                                    `** ${renamesolid24}** - Rename Channel`,
                                    `** ${user}** - Limit User`,
                                    `** ${shieldquarter}** - Privacy`,
                                    `** ${usercheck}** - Trust User`,
                                    `** ${userx}** - Untrust User`,
                                    `** ${uservoice}** - Kick User`,
                                    `** ${globe}** - Change Region`,
                                    `** ${crown}** - Transfer Ownership`,
                                    `** ${trash}** - Delete Channel`
                                ].join("\n")
                            )
                            .setFooter({
                                text: `Manage Your Voice Channel`,
                                iconURL: interaction.guild.iconURL() || undefined
                            })
                    ],
                    components: [row, row2]
                });

                interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "check",
                        client.user.id
                    )} The Channel <#${channel?.id}> was added to the TempVC Channels`
                });
            }

                break;
        }
    }
};
