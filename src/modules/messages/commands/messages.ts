import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ContainerBuilder,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
  TextDisplayBuilder
} from "discord.js";
import { PermissionType } from "../../../enums/permissionType.js";
import { ExtendedClient } from "../../../types/client.js";


export default {
  data: new SlashCommandBuilder()
    .setName("messages")
    .setDescription("Create, Manage and Delete Messages")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
  options: {
    once: false,
    permission: PermissionType.Messages,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
    userPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels],
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

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setEmoji("<:add:1260157236043583519>")
        .setCustomId("messages-create")
        .setLabel("Create Messages Template")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setEmoji("<:setting:1260156922569687071>")
        .setCustomId("messages-manage")
        .setLabel("Manage Messages")
        .setStyle(ButtonStyle.Secondary)
    );

    interaction.editReply({
      flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
      components: [new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          [
            `## Create, Manage and Delete Messages`,
            `You can create, manage and delete Messages using the buttons below.`,
            ``,
            `**Create Messages** - Create a new Messages.`,
            `**Manage Messages** - Manage your Messages.`,
            `**Delete Messages** - Delete an Messages.`,
            ``,
            `**Note**: Messages are stored in the database and can be used later on.`
          ].join("\n")
        )).addActionRowComponents(row)
      ],
    });
  }
};

