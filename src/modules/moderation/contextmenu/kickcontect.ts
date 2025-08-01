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
  UserSelectMenuBuilder,
} from "discord.js";
import pkg from "short-uuid";
const { uuid } = pkg;
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/client.js";
import { PermissionType } from "../../../enums/permissionType.js";

export default {
  options: {
    once: false,
    permission: PermissionType.Moderation,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.KickMembers],
    userPermissions: [PermissionFlagsBits.KickMembers],
    userHasOnePermission: true,
    isGuildOwner: false,
  },
  context: true,
  data: new ContextMenuCommandBuilder()
    .setName("Kick")
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
        PermissionsBitField.Flags.KickMembers
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
        .setCustomId("mdoeration-kick-user:" + uuids)
        .setDefaultUsers([interaction.targetId])
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
    interaction.reply({
      content: `## ${await convertToEmojiPng("user", client.user.id)} Create a new kick action and select the user to kick`,
      components: [row, row2],
      flags: MessageFlags.Ephemeral,
    });
  },
};
