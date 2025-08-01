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
  id: "bticket-update",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const uuid = interaction.customId.split(":")[1];

    const modal = new ModalBuilder();

    const name = new TextInputBuilder();
    const emoji = new TextInputBuilder();
    const style = new TextInputBuilder();

    modal
      .setTitle("Create an Button")
      .setCustomId(
        "bticket-update-modal:" +
          uuid +
          ":" +
          interaction.customId.split(":")[2]
      );

    name
      .setLabel("Name")
      .setCustomId("bticket-update-name")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Display Name of the Button")
      .setRequired(true);
    emoji
      .setLabel("Emoji")
      .setCustomId("bticket-update-emoji")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("[Optional] Emoji of the Button")
      .setRequired(false);
    style
      .setLabel("Style")
      .setCustomId("bticket-update-style")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(
        "Style of the Button - Primary, Secondary, Success, Danger"
      )
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(name),
      new ActionRowBuilder<TextInputBuilder>().addComponents(emoji),
      new ActionRowBuilder<TextInputBuilder>().addComponents(style)
    );

    interaction.showModal(modal);
  }
};
