import "dotenv/config";
import {
  ActionRowBuilder,
  ButtonStyle,
  Client,
  MessageFlags,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuInteraction
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "embed-create-add-sec",

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
      switch (value) {
        case "title": {
          const titlesec =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .addOptions(
                  {
                    label: "Title",
                    value: "title",
                    description: "Set the Title",
                    emoji: "<:heading:1321937110151729153>"
                  },

                  {
                    label: "URL",
                    value: "url",
                    description: "Set a URL for the Title",
                    emoji: "<:link:1321941111090057248>"
                  }
                )
                .setCustomId("embed-create-options-title:" + uuid)
            );
          interaction.reply({ flags: MessageFlags.Ephemeral, components: [titlesec] });

          break;
        }

        case "author": {
          const titlesec =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .addOptions(
                  {
                    label: "Author",
                    value: "author",
                    description: "Set the Author of the Embed",
                    emoji: "<:userdetail:1321937833296134205>"
                  },
                  {
                    label: "Image",
                    value: "img",
                    description: "Set an Image for the Author",
                    emoji: "<:imageadd:1260148502449754112>"
                  },
                  {
                    label: "URL",
                    value: "url",
                    description: "Set a URL for the Author",
                    emoji: "<:link:1321941111090057248>"
                  }
                )
                .setCustomId("embed-create-options-author:" + uuid)
            );
          interaction.reply({ flags: MessageFlags.Ephemeral, components: [titlesec] });
          break;
        }

        case "footer": {
          const titlesec =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .addOptions(
                  {
                    label: "Text",
                    value: "text",
                    description: "Set the Footer Text",
                    emoji: "<:description:1321938426576109768>"
                  },
                  {
                    label: "Image",
                    value: "img",
                    description: "Set an Image for the Footer",
                    emoji: "<:imageadd:1260148502449754112>"
                  }
                )
                .setCustomId("embed-create-options-footer:" + uuid)
            );
          interaction.reply({ flags: MessageFlags.Ephemeral, components: [titlesec] });
          break;
        }

        case "description": {
          if (!interaction.channel) throw new Error("No Channel found.");
          const message = await interaction.channel.messages.fetch(
            uuid
          );
          const embed = message.embeds[0];

          const modal = new ModalBuilder();

          const description = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-description:" + uuid);

          description
            .setLabel("Set a new Description for the Embed")
            .setValue(embed.data.description ? embed.data.description : "")
            .setPlaceholder("Nice Description")
            .setCustomId("embed-create-options-description-description-input")
            .setMaxLength(4000)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(description)
          );

          interaction.showModal(modal);

          break;
        }
        case "color": {
          if (!interaction.channel) throw new Error("No Channel found.");
          const message = await interaction.channel.messages.fetch(
            uuid
          );
          const embed = message.embeds[0];

          const modal = new ModalBuilder();

          const color = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-color:" + uuid);

          color
            .setLabel("Set a new Color for the Embed")
            .setPlaceholder("#FFFFFF")
            .setCustomId("embed-create-options-color-color-input")
            .setMaxLength(7)
            .setValue(embed.data.color ? `#${embed.data.color.toString(16)}` : "")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(color)
          );

          interaction.showModal(modal);
          break;
        }

        case "thumbnail": {
          if (!interaction.channel) throw new Error("No Channel found.");
          const message = await interaction.channel.messages.fetch(
            uuid
          );
          const embed = message.embeds[0];

          const modal = new ModalBuilder();

          const thumbnail = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-thumbnail:" + uuid);

          thumbnail
            .setLabel("Set a new Thumbnail for the Embed")
            .setValue(embed.data.thumbnail?.url ? embed.data.thumbnail.url : "")
            .setPlaceholder("https://example.com/image.png")
            .setCustomId("embed-create-options-thumbnail-thumbnail-input")
            .setMaxLength(2000)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(thumbnail)
          );

          interaction.showModal(modal);
          break;
        }
        case "image": {
          if (!interaction.channel) throw new Error("No Channel found.");
          const message = await interaction.channel.messages.fetch(
            uuid
          );
          const embed = message.embeds[0];

          const modal = new ModalBuilder();

          const image = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-image:" + uuid);

          image
            .setLabel("Set a new Image for the Embed")
            .setValue(embed.data.image?.url ? embed.data.image.url : "")
            .setCustomId("embed-create-options-image-image-input")
            .setPlaceholder("https://example.com/image.png")
            .setMaxLength(2000)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(image)
          );

          interaction.showModal(modal);
          break;
        }
        case "timestamp": {
          const modal = new ModalBuilder();

          const timestamp = new TextInputBuilder();

          modal
            .setTitle("Embed Editor")
            .setCustomId("modal-embed-create-timestamp:" + uuid);

          timestamp
            .setLabel("Set a new Timestamp for the Embed (UTC)")

            .setPlaceholder("YYYY-MM-DD HH:MM")
            .setCustomId("embed-create-options-timestamp-timestamp-input")

            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(timestamp)
          );

          interaction.showModal(modal);
          break;
        }
        case "field": {
          const fieldsec =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .addOptions(
                  {
                    label: "Add",
                    value: "add",
                    description: "Add a Field to the Embed",
                    emoji: "<:add:1260157236043583519>"
                  },
                  {
                    label: "Remove",
                    value: "remove",
                    description: "Remove a Field from the Embed",
                    emoji: "<:minus:1321943125706543155>"
                  }
                )
                .setCustomId("embed-create-options-field:" + uuid)
            );
          interaction.reply({ flags: MessageFlags.Ephemeral, components: [fieldsec] });
          break;
        }
      }
    });
  }
};
