import {
  ActionRowBuilder,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuInteraction
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "embed-create-import",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    const modal = new ModalBuilder();

    const json = new TextInputBuilder();

    modal.setTitle("Embed Import").setCustomId("modal-embed-import:" + interaction.customId.split(":")[1]);

    json
      .setLabel("JSON Code")
      .setCustomId("embed-import-input")
      .setPlaceholder(
        "Paste your JSON code here - e.g. from the DisBot Preview (app.disbot.app)"
      )
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(json)
    );

    interaction.showModal(modal);
  }
};
