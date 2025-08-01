import { EmbedBuilder, MessageFlags, UserSelectMenuInteraction } from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "embed-create-delete-sec",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    try {

      const messageId = interaction.customId.split(":")[1];

      interaction.values.forEach(async (value) => {
        switch (value) {
          case "title": {
            if (!interaction.guild) throw new Error("No Guild found.");
            if (!interaction.channel) throw new Error("No Channel found.");
            const message = await interaction.channel.messages.fetch(
              messageId
            );
            const embed = message.embeds[0];

            const updateembed = new EmbedBuilder(embed.data)
              .setTitle(null)
              .setURL(null);

            message.edit({ embeds: [updateembed] });
            interaction.deferUpdate();

            break;
          }

          case "author": {
            if (!interaction.guild) throw new Error("No Guild found.");
            if (!interaction.channel) throw new Error("No Channel found.");
            const message = await interaction.channel.messages.fetch(
              messageId
            );
            const embed = message.embeds[0];

            const updateembed = new EmbedBuilder(embed.data).setAuthor(null);

            message.edit({ embeds: [updateembed] });
            interaction.deferUpdate();
            break;
          }

          case "footer": {
            if (!interaction.guild) throw new Error("No Guild found.");
            if (!interaction.channel) throw new Error("No Channel found.");
            const message = await interaction.channel.messages.fetch(
              messageId
            );
            const embed = message.embeds[0];

            const updateembed = new EmbedBuilder(embed.data).setFooter(null);

            message.edit({ embeds: [updateembed] });
            interaction.deferUpdate();
            break;
          }

          case "description": {
            if (!interaction.guild) throw new Error("No Guild found.");
            if (!interaction.channel) throw new Error("No Channel found.");
            const message = await interaction.channel.messages.fetch(
              messageId
            );
            const embed = message.embeds[0];

            const updateembed = new EmbedBuilder(embed.data).setDescription(
              null
            );

            message.edit({ embeds: [updateembed] });
            interaction.deferUpdate();

            break;
          }

          case "thumbnail": {
            if (!interaction.guild) throw new Error("No Guild found.");
            if (!interaction.channel) throw new Error("No Channel found.");
            const message = await interaction.channel.messages.fetch(
              messageId
            );
            const embed = message.embeds[0];

            const updateembed = new EmbedBuilder(embed.data).setThumbnail(null);

            message.edit({ embeds: [updateembed] });
            interaction.deferUpdate();
            break;
          }
          case "image": {
            if (!interaction.guild) throw new Error("No Guild found.");
            if (!interaction.channel) throw new Error("No Channel found.");
            const message = await interaction.channel.messages.fetch(
              messageId
            );
            const embed = message.embeds[0];

            const updateembed = new EmbedBuilder(embed.data).setImage(null);

            message.edit({ embeds: [updateembed] });
            interaction.deferUpdate();
            break;
          }
          case "timestamp": {
            if (!interaction.guild) throw new Error("No Guild found.");
            if (!interaction.channel) throw new Error("No Channel found.");
            const message = await interaction.channel.messages.fetch(
              messageId
            );
            const embed = message.embeds[0];

            const updateembed = new EmbedBuilder(embed.data).setTimestamp(null);

            message.edit({ embeds: [updateembed] });
            interaction.deferUpdate();
            break;
          }
          case "field": {
            if (!client.user) throw new Error("No User found.");
            interaction.reply({
              content: `## ${await convertToEmojiPng(
                "info",
                client.user.id
              )} Please select the field option from the add menu.`,
              flags: MessageFlags.Ephemeral
            });
            break;
          }
          case "color":
            {
              if (!interaction.guild) throw new Error("No Guild found.");
              if (!interaction.channel) throw new Error("No Channel found.");
              const message = await interaction.channel.messages.fetch(
                messageId
              );
              const embed = message.embeds[0];

              const updateembed = new EmbedBuilder(embed.data).setColor(null);
              message.edit({ embeds: [updateembed] });
              interaction.deferUpdate();
            }
            break;
        }
      });
    } catch (error) {
      if (!client.user) throw new Error("No User found.");
      interaction.reply({
        content: `## ${await convertToEmojiPng(
          "info",
          client.user.id
        )} You must set have one of this: Description, Thumbnail, Image, Title`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
