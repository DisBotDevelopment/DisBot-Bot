import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { TIMESTAMP_PLACEHOLDER } from "../../../main/placeholder.js";

export default {
  id: "modal-embed-create-timestamp",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const timestamp = interaction.fields.getTextInputValue(
      "embed-create-options-timestamp-timestamp-input"
    );
    const message = await interaction.channel?.messages.fetch(
      interaction.customId.split(":")[1] as string
    );
    const embed = message?.embeds[0];

    let date = timestamp

    for (const [key, value] of Object.entries(TIMESTAMP_PLACEHOLDER)) {
      if (date.includes(key)) {
        date = date.replace(key, value)
      }
    }

    const updateembed = new EmbedBuilder(embed?.data).setTimestamp(
      Date.parse(date)
    );

    message?.edit({ embeds: [updateembed] });
    interaction.deferUpdate();
  }
};
