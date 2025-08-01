import { Client, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "modal-embed-create-footer",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const text = interaction.fields.getTextInputValue(
      "embed-create-options-footer-input"
    );
    const message = await interaction.channel?.messages.fetch(
      interaction.customId.split(":")[1] as string
    );
    const embed = message?.embeds[0];

    const updateembed = new EmbedBuilder(embed?.data).setFooter({
      text: text,
      iconURL: embed?.data.footer?.icon_url
        ? embed?.data.footer.icon_url
        : undefined
    });

    message?.edit({ embeds: [updateembed] });
    interaction.deferUpdate();
  }
};
