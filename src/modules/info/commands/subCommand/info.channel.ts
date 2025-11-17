import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, TextChannel } from "discord.js";
import { ExtendedClient } from "../../../../types/ExtendedClient.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
  subCommand: "info.channel",
  options: {
    once: false,
    permission: PermissionType.Info,
    cooldown: 3000,
    botPermissions: [],
    userPermissions: [PermissionFlagsBits.UseApplicationCommands],
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

    const getChannel = interaction.options.getChannel("channel") as TextChannel;

    let nsfw = getChannel.nsfw;
    let nsfwText = nsfw ? "Yes" : "No";

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("#2B2D31")
          .setTitle(`Informationen about ${getChannel.name}`)
          .setTimestamp()
          .setDescription(
            [
              `> -# ✨ - **Name**: ${getChannel.name}`,
              `> -# 🪪 - **ID**: \`\`${getChannel.id}\`\``,
              `> -# 🕙 - **Created**: <t:${Math.floor(
                (getChannel.createdTimestamp as number) / 1000
              )}:R>`,
              `> -# :performing_arts: - **Type**: \`\`${getChannel.type}\`\``,
              `> -# 🚫 - **NSFW**: ${nsfw}`,
              `> -# :1234: - **Position**: \`\`${getChannel.position} Channel\`\``,
              `> -# 🎨 - **Topic**: \`\`${getChannel.topic ? getChannel.topic : "no Topic"}\`\``,
              `> -# 🚫 - **NSFW**: ${nsfwText}`
            ].join("\n")
          )
      ]
    });
  }
};
