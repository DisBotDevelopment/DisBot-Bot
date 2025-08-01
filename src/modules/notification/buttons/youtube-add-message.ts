import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "youtube-add-message",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const modal = new ModalBuilder();
    const messageID = new TextInputBuilder();

    modal
      .setTitle("Youtube System - Add Message ID")
      .setCustomId(
        "youtube-add-message-modal:" + interaction.customId.split(":")[1]
      );

    messageID
      .setPlaceholder(
        "Message UUID example: " + interaction.customId.split(":")[1]
      )
      .setCustomId("youtube-add-message-id")
      .setStyle(TextInputStyle.Short)
      .setLabel("Message Template ID")
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(messageID));

    interaction.showModal(modal);
  },
};
