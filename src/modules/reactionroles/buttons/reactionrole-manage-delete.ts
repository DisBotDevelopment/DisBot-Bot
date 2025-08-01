import { ButtonInteraction, TextInputStyle } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
  id: "reactionroles-manage-delete",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const uuid = interaction.customId.split(":")[1];

    const nextEmbed = await database.reactionRoles.findFirst({
      where: {
        GuildId: interaction.guild?.id,
        UUID: uuid
      }
    });

    if (!nextEmbed) {
      if (!client.user) throw new Error("Client user is not defined");
      return interaction.reply({
        content: `## ${await convertToEmojiPng("error", client.user?.id)} The reaction-role with the UUID \`${uuid}\` does not exist`
      });
    }

    await database.reactionRoles.deleteMany({
      where: {
        GuildId: interaction.guild?.id,
        UUID: uuid
      }
    });

    if (!client.user) throw new Error("Client user is not defined");
    await interaction.update({
      content: `## ${await convertToEmojiPng("check", client.user?.id)} The reaction-role with the ID \`${uuid}\` has been deleted`,
      components: [],
      embeds: []
    });
  }
};
