import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "messages-create",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const modal = new ModalBuilder();

    const name = new TextInputBuilder();

    modal
      .setTitle("Message Template Name")
      .setCustomId("messages-create-modal");

    name
      .setLabel("Template Name")
      .setCustomId("name")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(name)
    );

    interaction.showModal(modal);
  }
};
