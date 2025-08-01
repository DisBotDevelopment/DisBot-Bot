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
  id: "embed-create-options-field",

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
        case "add": {
          const modal = new ModalBuilder();

          const name = new TextInputBuilder();
          const description = new TextInputBuilder();
          const inline = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-filds-add:" + interaction.customId.split(":")[1]);

          name
            .setLabel("Set a new Fild Name for the Embed")
            .setPlaceholder("Simple Name")
            .setCustomId("embed-create-options-filds-add-name")
            .setMaxLength(256)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
          description
            .setLabel("Set a new Fild Description for the Embed")
            .setPlaceholder("Simple Description")
            .setCustomId("embed-create-options-filds-add-description")
            .setMaxLength(256)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
          inline
            .setLabel("Set a the Fild Inline")
            .setPlaceholder("Inline (true/false)")
            .setCustomId("embed-create-options-filds-add-inline")
            .setMaxLength(5)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(name),
            new ActionRowBuilder<TextInputBuilder>().addComponents(description),
            new ActionRowBuilder<TextInputBuilder>().addComponents(inline)
          );

          interaction.showModal(modal);

          break;
        }

        case "remove": {
          const modal = new ModalBuilder();

          const fields = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-filds-remove:" + interaction.customId.split(":")[1]);

          fields
            .setLabel("Remove a Field")
            .setPlaceholder("1-25")
            .setCustomId("embed-create-options-filds-remove-field")
            .setMaxLength(2)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(fields));

          interaction.showModal(modal);
        }
      }
    });
  }
};
