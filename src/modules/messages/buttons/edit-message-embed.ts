import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "edit-message-embed",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const message = interaction.customId.split(":")[1];

    const messageToEdit = await interaction.channel?.messages.fetch(message);
    const embeds = messageToEdit?.embeds[0].data;

    let embed = new EmbedBuilder(embeds);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("embed-create-add-sec")
        .setPlaceholder("Select a Section")
        .addOptions(
          {
            label: "Title",
            value: "title",
            description: "Set the Title of the Embed",
            emoji: "<:heading:1321937110151729153>"
          },
          {
            label: "Author",
            value: "author",
            description: "Set the Author of the Embed",
            emoji: "<:userdetail:1321937833296134205>"
          },
          {
            label: "Footer",
            value: "footer",
            description: "Set the Footer of the Embed",
            emoji: "<:subtitle:1321938231788568586>"
          },
          {
            label: "Description",
            value: "description",
            description: "Set the Description of the Embed",
            emoji: "<:description:1321938426576109768>"
          },
          {
            label: "Color",
            value: "color",
            description: "Set the Color of the Embed",
            emoji: "<:color:1321938714741440552>"
          },
          {
            label: "Thumbnail",
            value: "thumbnail",
            description: "Set the Thumbnail of the Embed",
            emoji: "<:imageadd:1260148502449754112>"
          },
          {
            label: "Timestamp",
            value: "timestamp",
            description: "Set the Timestamp of the Embed",
            emoji: "<:timer:1321939051921801308>"
          },
          {
            label: "Image",
            value: "image",
            description: "Set the Image of the Embed",
            emoji: "<:imageadd:1260148502449754112>"
          },
          {
            label: "Field",
            value: "field",
            description: "Manage the Fields of the Embed",
            emoji: "<:folder:1321939544521572384>"
          }
        )
    );

    const deletsec =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("embed-create-delete-sec")
          .setPlaceholder("Remove a Option from the Embed")
          .addOptions(
            {
              label: "Title",
              value: "title",
              description: "Set the Title of the Embed",
              emoji: "<:heading:1321937110151729153>"
            },
            {
              label: "Author",
              value: "author",
              description: "Set the Author of the Embed",
              emoji: "<:userdetail:1321937833296134205>"
            },
            {
              label: "Footer",
              value: "footer",
              description: "Set the Footer of the Embed",
              emoji: "<:subtitle:1321938231788568586>"
            },
            {
              label: "Description",
              value: "description",
              description: "Set the Description of the Embed",
              emoji: "<:description:1321938426576109768>"
            },
            {
              label: "Color",
              value: "color",
              description: "Set the Color of the Embed",
              emoji: "<:color:1321938714741440552>"
            },
            {
              label: "Thumbnail",
              value: "thumbnail",
              description: "Set the Thumbnail of the Embed",
              emoji: "<:imageadd:1260148502449754112>"
            },
            {
              label: "Timestamp",
              value: "timestamp",
              description: "Set the Timestamp of the Embed",
              emoji: "<:timer:1321939051921801308>"
            },
            {
              label: "Image",
              value: "image",
              description: "Set the Image of the Embed",
              emoji: "<:imageadd:1260148502449754112>"
            },
            {
              label: "Field",
              value: "field",
              description: "Use the add Selectmenu to manage the Fields",
              emoji: "<:folder:1321939544521572384>"
            }
          )
      );

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("embed-create-export")
        .setLabel("Export JSON")
        .setEmoji("<:export:1321939859228721172>")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("embed-create-import")
        .setLabel("Import JSON")
        .setEmoji("<:import:1321939860868698185>")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId(
          "edit-embed-edit-save:" + interaction.customId.split(":")[1]
        )
        .setLabel("Edit the Embed")
        .setEmoji("<:save:1260157401496031244>")
        .setStyle(ButtonStyle.Success)
    );

    interaction.reply({
      embeds: [embed],
      components: [row, deletsec, buttons]
    });
  }
};
