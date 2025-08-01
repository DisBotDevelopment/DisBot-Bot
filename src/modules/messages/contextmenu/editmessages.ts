import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { DisbotInteractionType } from "../../../enums/disbotInteractionType.js";
import { PermissionType } from "../../../enums/permissionType.js";

export default {
  options: {
    once: false,
    permission: PermissionType.Other,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
    userPermissions: [PermissionFlagsBits.ManageMessages],
    userHasOnePermission: true,
    isGuildOwner: false,
  },
  type: DisbotInteractionType.ContextMenu,
  context: true,
  data: new ContextMenuCommandBuilder()
    .setName("Edit this message")
    .setNameLocalizations({
      de: "Bearbeite diese Nachricht",
    })

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .setType(ApplicationCommandType.Message),

  /**
   * @param {ContextMenuCommandInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ContextMenuCommandInteraction, client: ExtendedClient) {
    if (!interaction.guild) return;
    if (!interaction.inGuild()) return;

    const message = interaction.targetId;

    const messageToEdit = await interaction.channel?.messages.fetch(message);

    if (!messageToEdit) {
      return interaction.reply({
        content: "## I can't find that message!",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!client.user) throw new Error("Client user is not cached.");

    if (messageToEdit.author.id != client.user.id && messageToEdit.webhookId == null) {
      return interaction.reply({
        content: `## ${await convertToEmojiPng("errpr", client.user.id)} You can only edit messages sent by me or a webhook.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const actionRow = new ActionRowBuilder<ButtonBuilder>();

    if (messageToEdit.content) {
      actionRow.addComponents(
        new ButtonBuilder()
          .setCustomId("edit-message-message:" + messageToEdit.id)
          .setLabel("Edit Message")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("<:edit:1259961121075626066>")
      );
    }

    if (messageToEdit.embeds.length > 0) {
      actionRow.addComponents(
        new ButtonBuilder()
          .setCustomId("edit-message-embed:" + messageToEdit.id)
          .setLabel("Edit Embed")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("<:box:1259853376368148601>")
      );
    }

    interaction.reply({
      content: `## ${await convertToEmojiPng("edit", client.user.id)} Edit the message content or embed.\n -# **In the Future you can edit it in the DisBot Editor**`,
      components: [actionRow],
      flags: MessageFlags.Ephemeral,
    });
  },
};
