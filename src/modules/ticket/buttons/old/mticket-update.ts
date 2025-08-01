import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";

export default {
  id: "mticket-update",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const modal = new ModalBuilder();

    const name = new TextInputBuilder();
    const description = new TextInputBuilder();
    const emoji = new TextInputBuilder();
    const placeholder = new TextInputBuilder();

    modal
      .setTitle("Create a Option")
      .setCustomId(
        "mticket-update-modal:" +
          interaction.customId.split(":")[1] +
          ":" +
          interaction.customId.split(":")[2]
      );

    name
      .setLabel("Name")
      .setCustomId("mticket-update-name")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Display Name of the Option")
      .setRequired(true);
    description
      .setLabel("Description")
      .setCustomId("mticket-update-description")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("[Optional] Description of the Option")
      .setRequired(false);
    emoji
      .setLabel("Emoji")
      .setCustomId("mticket-update-emoji")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("[Optional] Emoji of the Option")
      .setRequired(false);

    placeholder
      .setLabel("Placeholder")
      .setCustomId("mticket-update-placeholder")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("[Optional] Placeholder of the Option");

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(name),
      new ActionRowBuilder<TextInputBuilder>().addComponents(description),
      new ActionRowBuilder<TextInputBuilder>().addComponents(emoji),
      new ActionRowBuilder<TextInputBuilder>().addComponents(placeholder)
    );

    interaction.showModal(modal);
  }
};
