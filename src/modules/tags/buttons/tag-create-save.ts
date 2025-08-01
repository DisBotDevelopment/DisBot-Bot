import { ButtonInteraction, MessageFlags, TextInputStyle } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
  id: "tag-create-save",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const UUID = interaction.customId.split(":")[1];

    const data = await database.tags.findFirst({
      where: {
        UUID: UUID
      }
    });

    if (!client.user) throw new Error("Client not found!");

    if (!data) {
      return interaction.reply({
        content: `## ${await convertToEmojiPng(
          "tag",
          client.user.id
        )} The Tag does not exist anymore`,
        flags: MessageFlags.Ephemeral
      });
    }

    if (!data.MessageId) {
      return interaction.reply({
        content: `## ${await convertToEmojiPng(
          "tag",
          client.user.id
        )} The Tag has no Message set`,
        flags: MessageFlags.Ephemeral
      });
    }

    interaction.update({
      content: `## ${await convertToEmojiPng("tag", client.user.id)} Tag \`\`${data.TagId
        }\`\` saved! All Data validated`
    });
  }
};
