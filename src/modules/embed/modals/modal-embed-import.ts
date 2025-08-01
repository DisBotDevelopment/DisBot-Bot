import { EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";

export default {
  id: "modal-embed-import",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const message = await interaction.channel?.messages.fetch(
        interaction.customId.split(":")[1]
      );
      const json = interaction.fields.getTextInputValue("embed-import-input");

      const updateembed = new EmbedBuilder(JSON.parse(json));

      message?.edit({ embeds: [updateembed] });
      interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "check",
          client.user?.id || ""
        )} The embed has been imported successfully.`,
      });

      if (!client.user) throw new Error("Client not found!");
    } catch (error) {

      interaction.editReply({
        content:
          "## An error occurred while trying to import the embed. \n-# Plase make sure the JSON is valid. If you need help, please contact the support server." +
          "\n-# Check that you habe a Description, Title, Thumbnail or Image" +
          error,
      });
    }
  }
};
