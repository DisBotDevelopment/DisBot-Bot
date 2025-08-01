import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { URL_PLACEHOLDER } from "../../../main/placeholder.js";

export default {
  id: "modal-embed-create-author-url",

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const url = interaction.fields.getTextInputValue(
      "embed-create-options-author-url-input"
    );
    const message = await interaction.channel?.messages.fetch(
      interaction.message?.reference?.messageId as string
    );
    const embed = message?.embeds[0];

    let link = url;

    for (const [key, value] of Object.entries(URL_PLACEHOLDER)) {
      if (url.includes(key)) {
        link = url.replace(key, value);
      }

      const updateembed = new EmbedBuilder(embed?.data).setAuthor({
        name: embed?.data.author?.name ? embed?.data.author?.name : "",
        iconURL: embed?.data.author?.icon_url
          ? embed?.data.author?.icon_url
          : undefined,
        url: link
      });

      message?.edit({ embeds: [updateembed] });
      interaction.deferUpdate();
    }
  }
}
