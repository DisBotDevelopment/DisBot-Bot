import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, Role } from "discord.js";
import { ExtendedClient } from "../../../../types/client.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
  subCommand: "info.role", options: {
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

    const { guild } = interaction;
    const getRole = interaction.options.getRole("role") as Role

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("#2B2D31")
          .setTitle(`Informationen about ${getRole?.name}`)

          .setTimestamp()
          .setDescription(
            [
              `## 📜 **Role Information**`,
              `> ✨ **Name**: ${getRole} (\`\`${getRole?.name}\`\`)`,
              `> 🪪 **ID**: \`\`${getRole?.id}\`\``,
              `> 🕙 **Created**: <t:${Math.floor(
                (getRole.createdTimestamp as number) / 1000
              )}:R>`,
              `> 📌  **Position**: \`\`${getRole.position}/${guild.roles.cache.size - 1
              }\`\``,
              `> 🎨 **Color**: \`\`${getRole.hexColor}\`\``,
              `> 👤 **Membercount**: \`\`${getRole.members.size}/${interaction.guild.memberCount}\`\``,
              `> 🛡️ **Permissions**: [ ${getRole.permissions.toArray()} ]`
            ].join("\n")
          )
      ],
    });
  }
};
