import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";

export default {
  id: "edit-message-modal",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    if (!client.user) throw new Error("Client user is not cached.");
    const messageID = interaction.customId.split(":")[1];
    const messageToEdit = await interaction.channel?.messages.fetch(messageID);

    if (!messageToEdit) {
      return interaction.reply({
        content: `## ${await convertToEmojiPng("error", client.user?.id)} I can't find that message!`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (messageToEdit.author.id !== client.user?.id && !messageToEdit.webhookId) {
      return interaction.reply({
        content: `## ${await convertToEmojiPng("error", client.user?.id)} You can only edit messages sent by me.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const content = interaction.fields.getTextInputValue(
      "edit-message-content"
    );

    if (!content) {
      return interaction.reply({
        content: `## ${await convertToEmojiPng("error", client.user?.id)} You must provide a message content!`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (content.length > 2000) {
      return interaction.reply({
        content: `## ${await convertToEmojiPng("error", client.user?.id)} The message content cannot exceed 2000 characters!`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (messageToEdit.webhookId) {
      const webhooks = await interaction.guild?.fetchWebhooks();
      const webhook = webhooks?.find(
        (wh) => wh.id === messageToEdit.webhookId
      );
      if (!webhook) {
        return interaction.reply({
          content: `## ${await convertToEmojiPng("error", client.user?.id)} I can't find the webhook for this message!`,
          flags: MessageFlags.Ephemeral,
        });
      }

      try {
        await webhook.editMessage(messageID, { content });
      } catch (err) {
        console.error(err);
        return interaction.reply({
          content: `## ${await convertToEmojiPng("error", client.user?.id)} Failed to edit the message via webhook!`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    messageToEdit.edit(content);
    interaction.reply({
      content: `## ${await convertToEmojiPng("check", client.user?.id)} Message edited successfully!`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
