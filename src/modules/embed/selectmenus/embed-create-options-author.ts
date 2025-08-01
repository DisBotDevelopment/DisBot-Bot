import {
  ActionRowBuilder,
  Client,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuInteraction
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "embed-create-options-author",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    if (!interaction.channel) throw new Error("No Channel found.");
    const message = await interaction.channel.messages.fetch(
      interaction.customId.split(":")[1]
    );

    const embed = message.embeds[0];
    interaction.values.forEach(async (value) => {
      switch (value) {
        case "author": {
          const modal = new ModalBuilder();

          const author = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-author:" + message.id);

          author
            .setLabel("Set a new Author for the Embed")
            .setValue(embed.data.author?.name ? embed.data.author.name : "")
            .setPlaceholder("Nice Author")
            .setCustomId("embed-create-options-author-input")
            .setMaxLength(256)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(author)
          );

          interaction.showModal(modal);

          break;
        }

        case "img": {
          const modal = new ModalBuilder();

          const img = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-author-img:" + message.id);

          img
            .setLabel("Set a new Image for the Embed")
            .setValue(
              embed.data.author?.icon_url ? embed.data.author.icon_url : ""
            )
            .setPlaceholder("https://example.com/image.png")
            .setCustomId("embed-create-options-author-img-input")
            .setMaxLength(256)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(img)
          );

          interaction.showModal(modal);

          break;
        }
        case "url": {
          const modal = new ModalBuilder();

          const url = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-author-url:" + message.id);

          url
            .setLabel("Set a new URL for the Embed")
            .setValue(embed?.data?.author?.url ? embed.data.author.url : "")
            .setPlaceholder("https://example.com")
            .setCustomId("embed-create-options-author-url-input")
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
