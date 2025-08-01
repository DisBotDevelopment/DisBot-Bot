import { Client, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "modal-embed-create-title",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const Title = interaction.fields.getTextInputValue(
      "embed-create-options-title-title"
    );
    const message = await interaction.channel?.messages.fetch(
      interaction.customId.split(":")[1]
    );
    const embed = message?.embeds[0];

    const updateembed = new EmbedBuilder(embed?.data).setTitle(Title);

    message?.edit({ embeds: [updateembed] });
    interaction.deferUpdate();
  }
};
