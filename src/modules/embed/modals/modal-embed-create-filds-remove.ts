import { Client, EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";

export default {
  id: "modal-embed-create-filds-remove",

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    try {
      const fieldIndex =
        parseInt(
          interaction.fields.getTextInputValue(
            "embed-create-options-filds-remove-field"
          ),
          10
        ) - 1; // Konvertiere Eingabe zu Index (1-basiert zu 0-basiert)

      if (!client.user) throw new Error("Client user is not available");

      if (isNaN(fieldIndex) || fieldIndex < 0) {
        return interaction.reply({
          content: `## ${await convertToEmojiPng(
            "error",
            client.user.id
          )} Invalid field number. Please try again.`,
          flags: MessageFlags.Ephemeral
        });
      }

      const message = await interaction.channel?.messages.fetch(
        interaction.customId.split(":")[1]
      );

      const embed = message?.embeds[0];
      if (!embed || !embed.fields || embed.fields.length <= fieldIndex) {
        return interaction.reply({
          content: `## ${await convertToEmojiPng(
            "error",
            client.user.id
          )} Invalid field number. Please try again.`,
          flags: MessageFlags.Ephemeral
        });
      }

      const updatedEmbed = new EmbedBuilder(embed.data).spliceFields(
        fieldIndex,
        1
      );

      await message.edit({
        embeds: [updatedEmbed]
      });

      await interaction.deferUpdate(); // Erfolgreiche Verarbeitung
    } catch (error) {
      console.error("Error in embed editor while reming field:", error);
      if (!client.user) throw new Error("Client user is not available");
      interaction.reply({
        content: `## ${await convertToEmojiPng(
          "error",
          client.user.id
        )} An error occurred while removing the field. Please try again.`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
