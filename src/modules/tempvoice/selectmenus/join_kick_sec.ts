import { Client, MessageFlags, UserSelectMenuInteraction } from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "join_kick_sec",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    interaction.values.forEach(async (value) => {
      if (value == interaction?.member?.user?.id)
        return interaction.followUp({ flags: MessageFlags.Ephemeral });

      if (!interaction.guild) throw new Error("No Guild found.");

      const member = interaction.guild.members.cache.get(interaction.user.id);

      if (!client.user) throw new Error("No Client found.");
      if (value == interaction.user.id)
        return interaction.followUp({
          content: `## ${await convertToEmojiPng(
            "error",
            client.user.id
          )} You can't kick yourself`,
          flags: MessageFlags.Ephemeral
        });

      const members = interaction.guild.members.cache.get(value);

      members?.voice.setChannel(null);

      interaction.editReply({
        content: `## ${await convertToEmojiPng(
          "check",
          client.user.id
        )} You have successfully Kicked user from the Channel`
      });
    });
  }
};
