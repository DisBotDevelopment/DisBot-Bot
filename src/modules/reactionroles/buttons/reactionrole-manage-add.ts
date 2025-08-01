import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "reactionrole-manage-add",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const uuid = interaction.customId.split(":")[1];

    const modal = new ModalBuilder();
    const message = new TextInputBuilder();

    modal
      .setTitle("Add Reaction Role")
      .setCustomId("reactionrole-manage-add-modal:" + uuid);

    message
      .setPlaceholder("Add Message URL")
      .setCustomId("reactionrole-manage-add-message")
      .setStyle(TextInputStyle.Paragraph)
      .setLabel("Add Message URL");

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(message)
    );

    interaction.showModal(modal);
  }
};
