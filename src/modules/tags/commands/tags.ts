import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { PermissionType } from "../../../enums/permissionType.js";

export default {
  help: {
    name: 'Tags',
    description: 'Create and manage tags',
    usage: '/tags',
    examples: [],
    aliases: [],
    docsLink: 'https://docs.disbot.app/docs/commands/tags'
  },
  data: new SlashCommandBuilder()
    .setName("tags")
    .setDescription("Manage Tags")
    .setDescriptionLocalizations({
      de: "Tags verwalten",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  options: {
    once: false,
    permission: PermissionType.Tags,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
    userPermissions: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageMessages],
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

    const embed = new EmbedBuilder()
      .setDescription(
        [
          `# ${await convertToEmojiPng("tag", client.user.id)} Tags`,
          ``,
          `> Create a tag to send a frequently used message more easily. And to manage it by using the message templates.`,
          ``
        ].join("\n")
      )
      .setColor("#2B2D31");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("tag-create-name")
        .setLabel("Create a Tag")
        .setEmoji("<:tag:1320069058179235850>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("tag-manage")
        .setLabel("Manage Tags")
        .setEmoji("<:setting:1260156922569687071>")
        .setStyle(ButtonStyle.Secondary)
    );

    interaction.editReply({
      embeds: [embed],
      components: [row]
    });
  }
};
