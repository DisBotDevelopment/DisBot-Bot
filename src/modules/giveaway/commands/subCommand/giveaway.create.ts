import {
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  MessageFlags,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { ExtendedClient } from "../../../../types/client.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
  subCommand: "giveaway.create",
  options: {
    once: false,
    permission: PermissionType.Giveaway,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageRoles],
    userPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageRoles],
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

    const modal = new ModalBuilder()
      .setCustomId("giveaway-create-modal")
      .setTitle("Create a giveaway")
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>()
          .addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-description")
              .setLabel("Giveaway Description")
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder("Enter the giveaway title")
              .setRequired(true)
          ),
        new ActionRowBuilder<TextInputBuilder>()
          .addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-duration")
              .setLabel("Giveaway duration")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Enter the giveaway duration (1d, 1h, 1m, 1s)")
              .setRequired(true)
          ),
        new ActionRowBuilder<TextInputBuilder>()

          .addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-winner")
              .setLabel("Giveaway winner")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Enter the number of winners (1, 2, 3)")
              .setRequired(true)
          ),
        new ActionRowBuilder<TextInputBuilder>()
          .addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-prize")
              .setLabel("Giveaway prize")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Enter the giveaway prize")
              .setRequired(true)
          ),
        new ActionRowBuilder<TextInputBuilder>()
          .addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-requirements")
              .setLabel("Giveaway requirements")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Enter the a Role Name")
              .setRequired(false)
          )
      );

    await interaction.showModal(modal);


  }
};
