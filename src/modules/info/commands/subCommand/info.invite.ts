import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
import { ExtendedClient } from "../../../../types/client.js";
import { convertToEmojiPng } from "../../../../helper/emojis.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
  subCommand: "info.invite", options: {
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
    const getURL = interaction.options.getString("url");

    var input = getURL?.replace("discord.gg/", "");
    var input = getURL?.replace("https://discord.gg/", "");
    var input = getURL?.replace("http://discord.gg/", "");
    var input = getURL?.replace("https://discord.com/invite/", "");
    var input = getURL?.replace("http://discord.com/invite/", "");

    let invite;

    try {
      invite = await client.fetchInvite(input as string);
    } catch (error) {
      return interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "error",
          client.user.id
        )} I can't find the invite \`\`${input}\`\``
      });
    }

    if (!invite) return;
    let me = client.guilds.cache.get(invite.guild?.id as string);

    return interaction.editReply({
      content: "",
      embeds: [
        new EmbedBuilder()
          .setColor("#2B2D31")
          .setTitle(`Informationen about the Invite \`\`${getURL}\`\``)
          .setTimestamp()
          .setDescription(
            [
              `## 📜 **Invite Information**`,
              `> ** :link: URL** ${getURL}`,
              `> ** :jigsaw: Code** [${invite.code}](https://discord.gg/${invite.code})`,
              `> ** :pencil: Channel** ${invite.channel} (\`\`${invite.channel?.id}\`\`)`,
              `> ** :shield: Guild** ${invite.guild?.name} (\`\`${invite.guild?.id}\`\`)`,
              `> ** :alarm_clock: Expires** ${Math.floor((invite.expiresTimestamp as number) / 1000) == 0
                ? "Never"
                : `<t:${Math.floor(
                  (invite.expiresTimestamp as number) / 1000
                )}:f> (<t:${Math.floor((invite.expiresTimestamp as number) / 1000)}:R>)`
              }`,
              `> ** :bust_in_silhouette: Created by** ${invite.inviter} (\`\`${invite.inviter?.id}\`\`) - \`\`${invite.inviter?.username}\`\``
            ].join("\n")
          )
      ]
    });
  }
};
