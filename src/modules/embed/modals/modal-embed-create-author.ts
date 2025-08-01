import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "modal-embed-create-author",

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const author = interaction.fields.getTextInputValue(
      "embed-create-options-author-input"
    );
    const message = await interaction.channel?.messages.fetch(
      interaction.customId.split(":")[1]
    );
    const embed = message?.embeds[0];

    const updateembed = new EmbedBuilder(embed?.data).setAuthor({
      name: author,
      iconURL: embed?.data.author?.icon_url
        ? embed.data.author.icon_url
        : undefined,
      url: embed?.data.author?.url ? embed.data.author.url : undefined
    });

    message?.edit({ embeds: [updateembed] });
    interaction.deferUpdate();
  }
};
