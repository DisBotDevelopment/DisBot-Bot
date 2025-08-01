import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
import { ExtendedClient } from "../../../../types/client.js";
import { convertToEmojiGif, convertToEmojiPng } from "../../../../helper/emojis.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
  subCommand: "info.server", options: {
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

    const { guild, member } = interaction;
    const {
      createdTimestamp,
      description,
      ownerId,
      members,
      memberCount,
      channels,
      emojis,
      stickers
    } = guild;
    let rolemap = guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => r)
      .slice(0, 15);

    if (!rolemap.length) rolemap = [];

    // Nur die ersten 15 Emojis anzeigen
    const first15Emojis = guild.emojis.cache.map((r) => r).slice(0, 15);

    const embedDescription = [
      `## **Information about this Guild:**`,
      ``,
      `> ✨ **Name**: ${guild.name}`,
      `> 🪪 **ID**: \`\`${guild.id}\`\``,
      `> :clock10: **Created**: <t:${Math.floor(createdTimestamp / 1000)}:R>`,
      `> :crown: **Owner**: <@${ownerId}> (\`\`${ownerId}\`\`)`,
      `> 💬 **Description**: ${description != null ? description : "No Server Description"
      }`,
      ``,
      `**Roles:**`,
      `> **[${rolemap.join(``).replace("@everyone", "") || "None"}]**`,
      `> ${await convertToEmojiPng(
        "moremembers",
        client.user.id
      )} **Total**: ${guild.roles.cache.size - 1}`,
      ``,
      `**${await convertToEmojiPng("members", client.user.id)} Members:**`,
      `> 👤 **Members**: ${members.cache.filter((member) => !member.user.bot).size
      }`,
      `> ${await convertToEmojiPng("textbot", client.user.id)} **Bots**: ${members.cache.filter((member) => member.user.bot).size
      }`,
      `> **:globe_with_meridians: Total**: ${memberCount}`,
      ``,
      `**:books: Channels:**`,
      `> ${guild.channels.cache.filter(
        (channel) => channel.type === ChannelType.GuildText
      ).size
      } ${await convertToEmojiPng("text", client.user.id)} ${guild.channels.cache.filter(
        (channel) => channel.type === ChannelType.GuildVoice
      ).size
      } ${await convertToEmojiPng("voice", client.user.id)} ${guild.channels.cache.filter(
        (channel) => channel.type === ChannelType.GuildCategory
      ).size
      } ${await convertToEmojiPng("cate", client.user.id)} ${guild.channels.cache.filter(
        (channel) => channel.type === ChannelType.PublicThread
      ).size
      } ${await convertToEmojiPng("thread", client.user.id)}
      > **:globe_with_meridians: Total**: ${channels.cache.size}`,
      ``,
      `**:art: Emojis & Stickers:**`,
      `> - **Animated Emojis**: ${emojis.cache.filter((emoji) => emoji.animated).size
      }`,
      `> - **Static Emojis**: ${emojis.cache.filter((emoji) => !emoji.animated).size
      }`,
      `> - **Stickers**: ${stickers.cache.size}`,
      `> - **Emojis**: ${first15Emojis}`,
      `> - **Total**: ${guild.emojis.cache.size}`,
      ``,
      `**:gem: Nitro Statistics:**`,
      `> ${await convertToEmojiGif("boosting", client.user.id)} **Tier**: ${guild.premiumTier
      }`,
      `> ${await convertToEmojiPng("boost", client.user.id)} **Boosts**: ${guild.premiumSubscriptionCount
      }`,
      `> ${await convertToEmojiPng("nitro", client.user.id)} **Boosters**: ${members.cache.filter((member) => member.premiumSince).size
      }`
    ].join("\n");

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("#2B2D31")
          .setAuthor({
            name: guild.name,
            iconURL: guild.iconURL({ size: 512 }) || undefined
          })
          .setThumbnail(guild.iconURL({ size: 512 }))
          .setDescription(embedDescription)
          .setTimestamp()
      ]
    });
  }
};
