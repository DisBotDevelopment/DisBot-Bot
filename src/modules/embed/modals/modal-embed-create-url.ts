import { Client, EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { URL_PLACEHOLDER } from "../../../main/placeholder.js";

export default {
  id: "modal-embed-create-url",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const url = interaction.fields.getTextInputValue(
      "embed-create-options-url-url"
    );

    let link = url.trim();

    for (const [placeholder, value] of Object.entries(URL_PLACEHOLDER)) {
      if (link.includes(placeholder)) {
        link = link.replace(placeholder, value);
      }
    }

    if (!link.includes("://")) {
      return interaction.reply({
        content: "## You need to provide a valid URL for the embed",
        flags: MessageFlags.Ephemeral
      });
    }

    const message = await interaction.channel?.messages.fetch(
      interaction.customId.split(":")[1]
    );
    const embed = message?.embeds[0];

    const updateembed = new EmbedBuilder(embed?.data).setURL(link);

    message?.edit({ embeds: [updateembed] });
    interaction.deferUpdate();
  }
};
