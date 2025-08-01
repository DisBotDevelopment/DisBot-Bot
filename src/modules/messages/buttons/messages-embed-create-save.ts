import { ButtonStyle, ChannelType, MessageFlags, UserSelectMenuInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
  id: "messages-embed-create-save",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    const uuid = interaction.customId.split(":")[1];
    const message = await interaction.channel?.messages.fetch(interaction.customId.split(":")[2]);
    const guildId = interaction.guild?.id;
    if (!message) {
      return interaction.reply({
        content: "Message not found.",
        flags: MessageFlags.Ephemeral
      });
    }

    await database.messageTemplates.update(
        {
          where: {
              Name: uuid
          },
          data: {
            EmbedJSON: JSON.stringify(message?.embeds[0].data)
          }
        }
    );

    if (!client.user) throw new Error("Client not found!");
    await interaction
      .reply({
        content: `## ${await convertToEmojiPng(
          "check",
          client.user.id
        )} The embed has been saved.\n-# You also can edit but note that you need to save it again.`,
        flags: MessageFlags.Ephemeral
      })
      .then(async () => {
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 5000);
      });
  }
};
