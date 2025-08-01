import { Client, EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";

export default {
  id: "modal-embed-create-filds-add",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const name = interaction.fields.getTextInputValue(
      "embed-create-options-filds-add-name"
    );
    const description = interaction.fields.getTextInputValue(
      "embed-create-options-filds-add-description"
    );
    const inline = interaction.fields.getTextInputValue(
      "embed-create-options-filds-add-inline"
    );
    const message = await interaction.channel?.messages.fetch(
      interaction.customId.split(":")[1]
    );
    const embed = message?.embeds[0];

    if (!client.user) throw new Error("Client user is not cached.");

    if (inline !== "true" && inline !== "false")
      return interaction.reply({
        content: `## ${await convertToEmojiPng(
          "error",
          client.user?.id
        )} Invalid inline value, please use "true" or "false".`,
        flags: MessageFlags.Ephemeral
      });

    if (inline == "true") {
      const updateembed = new EmbedBuilder(embed?.data).addFields({
        name: name,
        value: description,
        inline: true
      });
      message?.edit({ embeds: [updateembed] });
    } else {
      const updateembed = new EmbedBuilder(embed?.data).addFields({
        name: name,
        value: description,
        inline: false
      });

      message?.edit({ embeds: [updateembed] });
    }

    interaction.deferUpdate();
  }
};
