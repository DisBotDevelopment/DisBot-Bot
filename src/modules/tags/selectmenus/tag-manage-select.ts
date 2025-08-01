import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  MessageFlags,
  UserSelectMenuInteraction
} from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/client.js";
import { database } from "../../../main/database.js";

export default {
  id: "tag-manage-select",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    const uuid = interaction.customId.split(":")[1];

    interaction.values.forEach(async (value) => {
      const data = await database.tags.findFirst({
        where: {
          UUID: uuid
        }
      });
      if (!client.user) throw new Error("No User found.");
      if (!data) {
        return interaction.reply({
          content: `## ${await convertToEmojiPng(
            "error",
            client.user.id
          )} The tag you are trying to manage does not exist.`,
          flags: MessageFlags.Ephemeral
        });
      }
      if (!client.user) throw new Error("No User found.");
      const embed = new EmbedBuilder()
        .setColor("#2B2D31")
        .setDescription(
          [
            `## ${await convertToEmojiPng("tag", client.user?.id)} ${data.TagId
            }`,
            ``,
            `> **UUID:** \`${data.UUID}\``,
            `> **Tag Name:** \`${data.TagId}\``,
            `> **Tag Message:** \`${data.MessageId || `No Message`}\``,
            `> **TextCommand:** \`${data.IsTextInputCommand ? "Yes" : "No"}\``,
            `> **SlashCommand:** \`${data.IsShlashCommand ? "Yes" : "No"}\``,
            `> **Enabled:** \`${data.IsEnabled ? "Yes" : "No"}\``,
            `> **Permission Role:** ${data.PermissionRoleId
              ? `<@&${data.PermissionRoleId}>`
              : `\`\`\No Permission\`\``
            }`
          ].join("\n")
        );

      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("tag-create-set-message:" + value)
            .setLabel("Set a Message")
            .setEmoji("<:message:1322252985702551767>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("tag-create-set-iscommand:" + value)
            .setLabel("Toggle Slash Command")
            .setEmoji("<:terminal:1260322426323996783>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("tag-manage-toggle:" + value)
            .setLabel(`Toggle ${data.IsEnabled == true ? "Off" : "On"}`)
            .setEmoji(
              data.IsEnabled == true
                ? "<:toggleon:1301864515838672908>"
                : "<:toggleoff:1301864526848987196>"
            )
            .setStyle(ButtonStyle.Secondary)
        );

      const row2 =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("tag-create-set-istextcommand:" + value)
            .setLabel("Toggle Text Command")
            .setEmoji("<:renamesolid24:1259433901554929675>")
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId("tag-manage-delete:" + value)
            .setLabel(`Delete ${data.TagId}`)
            .setEmoji("<:trash:1259432932234367069>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("tag-manage:" + value)
            .setLabel(`Back`)
            .setEmoji("<:arrowbackregular24:1301119279088799815>")
            .setStyle(ButtonStyle.Secondary)
        );

      interaction.update({
        embeds: [embed],
        components: [row, row2]
      });
    });
  }
};
