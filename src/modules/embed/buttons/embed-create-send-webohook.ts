import {
    ActionRowBuilder,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "embed-create-send-webohook",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    const modal = new ModalBuilder();

    const name = new TextInputBuilder();

    modal
      .setTitle("Webhook Creation")
      .setCustomId("modal-embed-create-webhook");

    name
      .setLabel("Webhook URL")
      .setCustomId("embed-create-webhook-options-webhook")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder(
        "Example: https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMN0123456789"
      )
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(name)
    );

    interaction.showModal(modal);
  }
};
