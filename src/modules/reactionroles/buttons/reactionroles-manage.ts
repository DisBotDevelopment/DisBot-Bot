import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
  id: "reactionroles-manage",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const [action, uuid, currentIndexStr] = interaction.customId.split(":");
    const currentIndex = parseInt(currentIndexStr) || 0;
    const guildId = interaction.guild?.id;
    const pageSize = 5;

    try {
      const allEmbeds = await database.reactionRoles
        .findMany({ 
          where: {
            GuildId: guildId
          }
         })

      if (!allEmbeds.length) {
        if (!client.user) throw new Error("Client user is not defined");
        return interaction.reply({
          content: `## ${await convertToEmojiPng("error", client.user?.id)} There are no reaction-roles to manage`,
          flags: MessageFlags.Ephemeral
        });
      }

      const embedsList = allEmbeds.slice(currentIndex, currentIndex + pageSize);
      const embedMessages = embedsList.map((embed) => {
        return new EmbedBuilder()
          .setColor("#2B2D31")
          .setDescription(
            [
              `**Label**: \`${embed.Emoji ? embed.Emoji : embed.Button?.Label ? embed.Button?.Label : embed.SelectMenu?.Label}\``,
              `**Type**: \`${embed.Emoji ? "Emoji" : embed.Button?.Label ? "Button" : "Select Menu"}\``,
              `**Roles**: <@&${embed.Roles?.join(">, <@&")}>`,
              `**UUID**: \`\`\`${embed.UUID}\`\`\``
            ].join("\n")
          );
      });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("reactionroles-manage-select")
        .setPlaceholder("Select a reaction-role to manage")
        .addOptions(
          embedsList.map((embed) => ({
            label: embed.Emoji
              ? embed?.Emoji
              : embed?.Button?.Label
                ? embed?.Button?.Label
                : embed?.SelectMenu?.Label
                  ? embed?.SelectMenu?.Label
                  : "No Label",
            description: `UUID: ${embed.UUID}`,
            value: embed.UUID as string,
            emoji: "<:role:1335667919119585480>"
          })) as any
        );

      const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setEmoji("<:arrowbackregular24:1301119279088799815>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(
            `reactionroles-manage:${uuid}:${currentIndex - pageSize}`
          )
          .setDisabled(currentIndex === 0),
        new ButtonBuilder()
          .setEmoji("<:next:1287457822526935090>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(
            `reactionroles-manage:${uuid}:${currentIndex + pageSize}`
          )
          .setDisabled(currentIndex + pageSize >= allEmbeds.length)
      );

      const selectMenuRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          selectMenu
        );

      await interaction.update({
        embeds: embedMessages,
        components: [navigationRow, selectMenuRow]
      });
    } catch (error) {
      console.error("Error:", error);
      interaction.reply({
        content:
          "## An error occurred while fetching the buttons. Please try again later",
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
