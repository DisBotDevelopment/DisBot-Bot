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
  subCommand: "moderation.timeout",
  options: {
    once: false,
    permission: PermissionType.Moderation,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.ModerateMembers],
    userPermissions: [PermissionFlagsBits.ModerateMembers],
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
        PermissionsBitField.Flags.MuteMembers
      )
    ) {
      if (!client.user) throw new Error("Client is not defined");
      return interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "error",
          client.user?.id
        )} I don't have the required permissions to mute members`,
      });
    }
    if (
      !(
        interaction.member?.permissions instanceof PermissionsBitField &&
        interaction.member.permissions.has(
          PermissionsBitField.Flags.MuteMembers
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
        )} You don't have the required permissions to mute members`,
      });
    }

    const uuids = uuid();

    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("moderation-timeout-user:" + uuids)
        .setMaxValues(25)
        .setMinValues(1)
        .setPlaceholder("Select the user to timeout")
    );

    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("moderation-timeout-time:" + uuids)
        .setLabel("Duration")
        .setEmoji("<:timer:1321939051921801308>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("moderation-timeout-reason:" + uuids)
        .setLabel("Reason")
        .setEmoji("<:renamesolid24:1259433901554929675>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("moderation-timeout-dmmessage:" + uuids)
        .setLabel("Dm Message")
        .setEmoji("<:message:1322252985702551767>")
        .setStyle(ButtonStyle.Secondary)
    );

    client.cache.set(uuids, {
      reason: "",
      dmmessage: "",
      time: "",
    });

    if (!client.user) throw new Error("Client is not ready");
    interaction.editReply({
      content: `## ${await convertToEmojiPng("user", client.user.id)} Create a new timeout action and select the user to timeout`,
      components: [row, row2],
    });
  },
};
