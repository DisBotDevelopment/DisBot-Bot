import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "youtube-add-channelname",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const modal = new ModalBuilder();
    const channelname = new TextInputBuilder();

    modal
      .setTitle("Youtube add Channel ID")
      .setCustomId("youtube-add-channelname-modal");

    channelname
      .setPlaceholder("Enter the channel id")
      .setCustomId("youtube-add-channelname")
      .setStyle(TextInputStyle.Short)
      .setLabel("Youtube Channel ID")
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(channelname)
    );

    interaction.showModal(modal);
  }
};
