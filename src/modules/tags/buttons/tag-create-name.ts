import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "tag-create-name",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const modal = new ModalBuilder();
    const tagID = new TextInputBuilder();

    modal.setTitle("Create a Tag").setCustomId("tag-create-name-modal");

    tagID.setCustomId("tag-create-name-input-id");
    tagID.setPlaceholder("The Name of the Tag e.g. faq");
    tagID.setLabel("Tag Name");
    tagID.setRequired(true);
    tagID.setStyle(TextInputStyle.Short);
    tagID.setMinLength(3);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(tagID)
    );

    interaction.showModal(modal);
  }
};
