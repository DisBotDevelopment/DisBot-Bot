import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "twitch-add-channelname",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const modal = new ModalBuilder();
    const channelname = new TextInputBuilder();

    modal
      .setTitle("Twitch Add Channel Name")
      .setCustomId("twitch-add-channelname-modal");

    channelname
      .setPlaceholder("Enter the channel name")
      .setCustomId("twitch-add-channelname")
      .setStyle(TextInputStyle.Short)
      .setLabel("Twitch Channel Name")
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(channelname));

    interaction.showModal(modal);
  },
};
