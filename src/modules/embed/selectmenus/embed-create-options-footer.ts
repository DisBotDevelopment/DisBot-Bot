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
  id: "embed-create-options-footer",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    if (!interaction.channel) throw new Error("No Guild found.");
    const message = await interaction.channel.messages.fetch(
      interaction.customId.split(":")[1]
    );
    const embed = message.embeds[0];
    interaction.values.forEach(async (value) => {
      switch (value) {
        case "text": {
          const modal = new ModalBuilder();

          const text = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-footer:" + message.id);

          text
            .setLabel("Set a new Text for the Embed")
            .setValue(embed.data.footer?.text ? embed.data.footer.text : "")
            .setCustomId("embed-create-options-footer-input")
            .setPlaceholder("Cool Footer Text!")
            .setMaxLength(256)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(text)
          );

          interaction.showModal(modal);

          break;
        }

        case "img": {
          const modal = new ModalBuilder();

          const img = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-footer-img:" + message.id);

          img
            .setLabel("Set a new URL for the Embed")
            .setValue(
              embed.data.footer?.icon_url ? embed.data.footer.icon_url : ""
            )
            .setPlaceholder("htttps://example.com/image.png")
            .setCustomId("embed-create-options-footer-img-input")
            .setMaxLength(256)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(img)
          );

          interaction.showModal(modal);

          break;
        }
      }
    });
  }
};
