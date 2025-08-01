import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "moderation-timeout-time",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const uuids = interaction.customId.split(":")[1];

    const modal = new ModalBuilder();
    const reason = new TextInputBuilder();

    modal
      .setTitle("Set Duration")
      .setCustomId("moderation-timeout-time-modal:" + uuids);

    reason
      .setCustomId("moderation-timeout-time-input")
      .setLabel("Enter a duration")
      .setPlaceholder("e.g. 1d, 1w, 1m, 1y, Permanent(leave it empty)")
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(10)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(reason)
    );

    interaction.showModal(modal);
  },
};
