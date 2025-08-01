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
    name: 'Reaction Roles',
    description: 'Create and manage reaction roles',
    usage: '/reactionroles',
    examples: [],
    aliases: [],
    docsLink: 'https://docs.disbot.app/docs/commands/reactionroles'
  },
  data: new SlashCommandBuilder()
    .setName("reactionroles")
    .setDescription("Manage Reaction Roles")
    .setDescriptionLocalizations({
      de: "Reaktionsrollen verwalten",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  options: {
    once: false,
    permission: PermissionType.ReactionRoles,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
    userPermissions: [PermissionFlagsBits.ManageRoles],
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
    if (!client.user) throw new Error("Client User is not defined");

    const embed = new EmbedBuilder()
      .setColor("#2B2D31")
      .setDescription(
        [
          `## ${await convertToEmojiPng("role", client.user?.id)} Reaction Roles`,
          ``,
          `> Create and Manage Reaction Roles from the Server`,
          `‎ **User can react to a message to get a role/roles**`,
          `‎‎ - Create Reaction Role`,
          `‎‎ - Setup a action/reaction role`,
          `‎‎ - Manage Reaction Role`
        ].join("\n")
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("reactionroles-create")
        .setLabel("Create Reaction Role")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("<:addchannel:1324458759589728387>"),
      new ButtonBuilder()
        .setCustomId("reactionroles-manage")
        .setLabel("Manage Reaction Role")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("<:setting:1260156922569687071>")
    );

    interaction.editReply({
      embeds: [embed],
      components: [row]
    });
  }
};
