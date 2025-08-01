import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "welcome-image-create-button-setup",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const message = await interaction.message.fetch();
    const modal = new ModalBuilder();

    const background = new TextInputBuilder();
    const theme = new TextInputBuilder();
    const color = new TextInputBuilder();
    const channel = new TextInputBuilder();

    modal
      .setTitle("Create a Message")
      .setCustomId("welcome-image-create-setup");

    background
      .setLabel("Background")
      .setCustomId("welcome-image-create-background")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("https://i.imgur.com/kjEQRRI.png")
      .setRequired(true);

    theme
      .setLabel("Theme")
      .setCustomId("welcome-image-create-theme")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Use Dark, Circuit, Code")
      .setRequired(true);

    color
      .setLabel("Gradient Color")
      .setCustomId("welcome-image-create-color")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Usage: #ffffff,#000000 - (Without the Space)")
      .setRequired(true);
    channel
      .setLabel("Channel ID")
      .setCustomId("welcome-message-create-channel")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("NOT CHANGE")
      .setValue(`${message.content}`)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(background),
      new ActionRowBuilder<TextInputBuilder>().addComponents(theme),
      new ActionRowBuilder<TextInputBuilder>().addComponents(color),
      new ActionRowBuilder<TextInputBuilder>().addComponents(channel)
    );

    interaction.showModal(modal);
    await message.delete();
  }
};
