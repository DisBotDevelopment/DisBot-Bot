import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
  id: "tag-create-set-iscommand",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const uuid = interaction.customId.split(":")[1];

    const data = await database.tags.findFirst({
      where: {
        UUID: uuid
      }
    });

    if (!client.user) throw new Error("Client user is not cached.");
    if (data?.IsShlashCommand) {
      await database.tags.update(
        {
          where: { UUID: uuid },
          data: {
            IsShlashCommand: false,
            CommandDescription: "",
          }
        }
      );

      return interaction.reply({
        content: `## ${await convertToEmojiPng(
          "check",
          client.user?.id
        )} This tag is no longer a slash command.`,
        flags: "Ephemeral",
      });
    }

    const modal = new ModalBuilder();
    const description = new TextInputBuilder();

    modal
      .setTitle("Set Command Description")
      .setCustomId("tag-create-set-iscommand-modal:" + uuid);

    description
      .setLabel("Command Description")
      .setPlaceholder("Enter the command description")
      .setStyle(TextInputStyle.Short)
      .setCustomId("tag-create-set-iscommand-modal-description")
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(description)
    );

    interaction.showModal(modal);
  },
};
