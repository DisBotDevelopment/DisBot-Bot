import { ButtonStyle, ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, TextChannel } from "discord.js";
import { ExtendedClient } from "../../../../types/client.js";
import { convertToEmojiPng } from "../../../../helper/emojis.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
  subCommand: "moderation.clear", options: {
    once: false,
    permission: PermissionType.Moderation,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.ManageMessages],
    userPermissions: [PermissionFlagsBits.ManageMessages],
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
    const { guild, options, channel } = interaction;
    const getAmount = options.getInteger("amount");
    try {
      let { size } = await (channel as TextChannel).bulkDelete(
        (getAmount as number) + 1
      );

      if (!client.user) throw new Error("Client user not found");

      return interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "check",
          client.user.id
        )} Deleted ${size} messages.`
      });
    } catch (error) {
      if (!client.user) throw new Error("Client user not found");
      return interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "error",
          client.user.id
        )} I can't delete messages older than 14 days.`
      });
    }
  }
};
