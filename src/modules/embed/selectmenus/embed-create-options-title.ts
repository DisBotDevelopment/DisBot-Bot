import {
  ActionRowBuilder,
  ButtonStyle,
  Client,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuInteraction
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "embed-create-options-title",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    if (!interaction.guild) throw new Error("No Guild found.");
    if (!interaction.channel) throw new Error("No Channel found.");
    const message = await interaction.channel.messages.fetch(
      interaction.customId.split(":")[1]
    );
    const embed = message.embeds[0];
    interaction.values.forEach(async (value) => {
      switch (value) {
        case "title": {
          const modal = new ModalBuilder();

          const title = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-title:" + interaction.customId.split(":")[1]);

          title
            .setLabel("Set a new Title for the Embed")
            .setValue(embed.data?.title ? embed.data.title : "")
            .setPlaceholder("Title")
            .setCustomId("embed-create-options-title-title")
            .setMaxLength(256)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(title)
          );

          interaction.showModal(modal);

          break;
        }

        case "url": {
          const modal = new ModalBuilder();

          const url = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-url:" + interaction.customId.split(":")[1]);

          url
            .setLabel("Set a new URL for the Embed")
            .setValue(embed.data.url ? embed.data.url : "")
            .setPlaceholder("https://example.com")
            .setCustomId("embed-create-options-url-url")
            .setMaxLength(256)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(url)
          );

          interaction.showModal(modal);

          break;
        }
      }
    });
  }
};
