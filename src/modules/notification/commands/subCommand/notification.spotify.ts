import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits
} from "discord.js";
import { ExtendedClient } from "../../../../types/client.js";
import { convertToEmojiPng } from "../../../../helper/emojis.js";
import { PermissionType } from "../../../../enums/permissionType.js";
import { database } from "../../../../main/database.js";

export default {
  subCommand: "notification.spotify",
  options: {
    once: false,
    permission: PermissionType.Notification,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
    userPermissions: [PermissionFlagsBits.ManageGuild],
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

    const data = await database.guildFeatureToggles.findFirst({
      where: {
        GuildId: interaction.guild.id
      }
    });
    if (!client.user) throw new Error("Client user not found");
    const embed = new EmbedBuilder()
      .setDescription(
        [
          `## ${await convertToEmojiPng("spotify", client.user.id)} Spotify`,
          ``,
          `**Enable Spotify Notifications** - Toggle Spotify Notifications`,
          `**Add a Spotify Channel** - Add a Spotify Channels to the System`,
          `**Manage Spotify Channels** - Manage the Spotify Channels`
        ].join("\n")
      )
      .setColor("#2B2D31");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("spotify-toggle")
        .setLabel("Enable Spotify Notifications")
        .setEmoji(
          data?.SpotifyEnabled
            ? "<:toggleoff:1301864526848987196>"
            : "<:toggleon:1301864515838672908>"
        )
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("spotify-add-channelname")
        .setLabel("Add a Spotify Show Channel")
        .setEmoji("<:add:1260157236043583519>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("spotify-manage")
        .setEmoji("<:setting:1260156922569687071>")
        .setLabel("Manage spotify Channels")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({
      embeds: [embed],
      components: [row]
    });
  }
};
