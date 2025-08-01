import {
  ActionRowBuilder,
  ButtonStyle,
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
  subCommand: "welcome.image",
  options: {
    once: false,
    permission: PermissionType.LeaveWelcome,
    cooldown: 3000,
    botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
    userPermissions: [PermissionFlagsBits.ManageMessages],
    userHasOnePermission: true,
    isGuildOwner: false,
  },
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {


    return interaction.reply({
      content: "OoO, This Command is currently disabled because we are re-coding the image generation",
      flags: MessageFlags.Ephemeral
    });

    // const modal = new ModalBuilder();

    // const channel = new TextInputBuilder();
    // const title = new TextInputBuilder();
    // const subtitle = new TextInputBuilder();
    // const text = new TextInputBuilder();
    // const color = new TextInputBuilder();

    // modal.setTitle("Create a Message").setCustomId("welcome-image-create");

    // title
    //   .setLabel("Title")
    //   .setCustomId("welcome-image-create-title")
    //   .setStyle(TextInputStyle.Short)
    //   .setPlaceholder("Welcome and hello to our server!")
    //   .setRequired(true);

    // subtitle
    //   .setLabel("Subtitle")
    //   .setCustomId("welcome-image-create-subtitle")
    //   .setStyle(TextInputStyle.Short)
    //   .setPlaceholder("Join our community")
    //   .setRequired(true);

    // text
    //   .setLabel("Text")
    //   .setCustomId("welcome-image-create-text")
    //   .setStyle(TextInputStyle.Short)
    //   .setPlaceholder("Read our Rules")
    //   .setRequired(true);

    // color
    //   .setLabel("Color")
    //   .setCustomId("welcome-image-create-color")
    //   .setStyle(TextInputStyle.Short)
    //   .setPlaceholder("#ffffff")
    //   .setRequired(true);

    // channel
    //   .setLabel("Channel ID")
    //   .setCustomId("welcome-message-create-channel")
    //   .setStyle(TextInputStyle.Short)
    //   .setPlaceholder("NOT CHANGE")
    //   .setValue(`${interaction.options.getChannel("channel")?.id}`)
    //   .setRequired(false);

    // modal.addComponents(
    //   new ActionRowBuilder<TextInputBuilder>().addComponents(title),
    //   new ActionRowBuilder<TextInputBuilder>().addComponents(subtitle),
    //   new ActionRowBuilder<TextInputBuilder>().addComponents(text),
    //   new ActionRowBuilder<TextInputBuilder>().addComponents(color),
    //   new ActionRowBuilder<TextInputBuilder>().addComponents(channel)
    // );

    // interaction.showModal(modal);
  },
};
