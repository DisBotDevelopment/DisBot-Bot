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
const { uuid } = pkg;
import { ExtendedClient } from "../../../../types/client.js";
import { convertToEmojiPng } from "../../../../helper/emojis.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
  subCommand: "moderation.kick", options: {
    once: false,
    permission: PermissionType.Moderation,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.KickMembers],
    userPermissions: [PermissionFlagsBits.KickMembers],
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
        PermissionsBitField.Flags.KickMembers
      )
    ) {
      if (!client.user) throw new Error("Client is not defined");
      return interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "error",
          client.user?.id
        )} I don't have the required permissions to Kick Members`,
      });
    }
    if (
      !(
        interaction.member?.permissions instanceof PermissionsBitField &&
        interaction.member.permissions.has(
          PermissionsBitField.Flags.KickMembers
        )
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
        )} You don't have the required permissions to Kick Members`,
      });
    }

    const uuids = uuid();

    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("moderation-kick-user:" + uuids)
        .setMaxValues(25)
        .setMinValues(1)
        .setPlaceholder("Select the user to kick")
    );

    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("moderation-kick-reason:" + uuids)
        .setLabel("Reason")
        .setEmoji("<:renamesolid24:1259433901554929675>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("moderation-kick-dmmessage:" + uuids)
        .setLabel("Dm Message")
        .setEmoji("<:message:1322252985702551767>")
        .setStyle(ButtonStyle.Secondary)
    );

    client.cache.set(uuids, {
      reason: "",
      dmmessage: "",
    });

    if (!client.user) throw new Error("Client is not ready");
    interaction.editReply({
      content: `## ${await convertToEmojiPng("user", client.user.id)} Create a new kick action and select the user to kick`,
      components: [row, row2],
    });
  },
};
