import { Client, ColorResolvable, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { cli } from "winston/lib/winston/config/index.js";
import cluster from "cluster";

export default {
  id: "modal-embed-create-color",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const color = interaction.fields.getTextInputValue(
      "embed-create-options-color-color-input"
    );
    const message = await interaction.channel?.messages.fetch(
      interaction.customId.split(":")[1]
    );
    const embed = message?.embeds[0];
    try {
      const updateembed = new EmbedBuilder(embed?.data).setColor(
        color ? color as ColorResolvable : "#2B2D31"
      ); message?.edit({ embeds: [updateembed] });
      interaction.deferUpdate();
    } catch (e) {
      if (!client.user) throw new Error("No Client")
      return interaction.reply({ content: `## ${await convertToEmojiPng("error", client.user?.id)} Please use a valid hex color code!` })
    }

  },
};