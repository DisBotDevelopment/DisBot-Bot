import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    PermissionsBitField,
    UserSelectMenuBuilder,
} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "moderation.ban",
    options: {
        once: false,
        permission: PermissionType.Moderation,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.BanMembers],
        userPermissions: [PermissionFlagsBits.BanMembers],
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
        if (
            !interaction.guild?.members.me?.permissions.has(
                PermissionsBitField.Flags.Administrator
            ) ||
            !interaction.guild?.members.me?.permissions.has(
                PermissionsBitField.Flags.BanMembers
            )
        ) {
            if (!client.user) throw new Error("Client is not defined");
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user?.id
                )} I don't have the required permissions to ban members`,
            });
        }
        if (
            !(
                interaction.member?.permissions instanceof PermissionsBitField &&
                interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
            ) ||
            !(
                interaction.member?.permissions instanceof PermissionsBitField &&
                interaction.member.permissions.has(
                    PermissionsBitField.Flags.Administrator
                )
            )
        ) {
            if (!client.user) throw new Error("Client is not defined");
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user?.id
                )} You don't have the required permissions to ban members`,
            });
        }

        const uuids = uuid();

        const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
            new UserSelectMenuBuilder()
                .setCustomId("moderation-ban-select:" + uuids)
                .setPlaceholder("Select a user")
                .setMinValues(1)
                .setMaxValues(25)
        );

        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("moderation-ban-set-dmmessage:" + uuids)
                .setLabel("Set DM Message")
                .setEmoji("<:message:1322252985702551767>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("moderation-ban-set-reason:" + uuids)
                .setLabel("Reason")
                .setEmoji("<:renamesolid24:1259433901554929675>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("moderation-ban-set-duration:" + uuids)
                .setLabel("Duration")
                .setEmoji("<:timer:1321939051921801308>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("moderation-ban-id")
                .setLabel("Ban with ID")
                .setEmoji("<:id:1330536124652851292>")
                .setStyle(ButtonStyle.Secondary)
        );

        await database.guildBans.create({
            data: {
                UUID: uuids,
                Guilds: {
                    connect: {
                        GuildId: interaction.guild.id
                    }
                }
            }
        });

        if (!client.user) throw new Error("Client is not defined");
        interaction.editReply({
            content: `## ${await convertToEmojiPng("user", client.user.id)} Edit you ban settings and then select the user to ban`,
            components: [row, row2],
        });
    },
};
