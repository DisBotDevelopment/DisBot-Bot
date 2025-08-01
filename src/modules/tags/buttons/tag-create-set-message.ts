import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "tag-create-set-message",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const modal = new ModalBuilder();
    const tagID = new TextInputBuilder();

    modal
      .setTitle("Set Message Template ID")
      .setCustomId(
        "tag-create-set-message-modal:" + interaction.customId.split(":")[1]
      );

    tagID.setCustomId("tag-create-set-message-input-id");
    tagID.setLabel("Message Template ID");
    tagID.setRequired(true);
    tagID.setStyle(TextInputStyle.Short);
    tagID.setMinLength(5);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(tagID)
    );

    interaction.showModal(modal);
  }
};
