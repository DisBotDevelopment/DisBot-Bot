import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    InteractionContextType,
    MessageFlags,
    PermissionFlagsBits,
    PermissionsBitField,
    TextInputStyle,
    UserSelectMenuBuilder,
} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {database} from "../../../main/database.js";

export default {
    options: {
        once: false,
        permission: PermissionType.Moderation,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.BanMembers],
        userPermissions: [PermissionFlagsBits.BanMembers],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    data: new ContextMenuCommandBuilder()
        .setName("Ban")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setContexts(InteractionContextType.Guild)
        .setType(ApplicationCommandType.User),

    /**
     * @param {ContextMenuCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ContextMenuCommandInteraction,
        client: ExtendedClient
    ) {
        if (
            !interaction.guild?.members.me?.permissions.has(
                PermissionsBitField.Flags.Administrator
            ) ||
            !interaction.guild?.members.me?.permissions.has(
                PermissionsBitField.Flags.BanMembers
            )
        ) {
            if (!client.user) throw new Error("Client is not defined");
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user?.id
                )} I don't have the required permissions to ban members`,
                flags: MessageFlags.Ephemeral,
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
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user?.id
                )} You don't have the required permissions to ban members`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const uuids = uuid();

        const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
            new UserSelectMenuBuilder()
                .setCustomId("moderation-ban-select:" + uuids)
                .setPlaceholder("Select a user")
                .setDefaultUsers(interaction.targetId)
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
        interaction.reply({
            content: `## ${await convertToEmojiPng("user", client.user.id)} Edit you ban settings and then select the user to ban`,
            components: [row, row2],
            flags: MessageFlags.Ephemeral,
        });
    },
};
