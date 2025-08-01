import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "moderation-ban-set-reason",
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
      .setTitle("Set Reason")
      .setCustomId("moderation-ban-set-reason-modal:" + uuids);

    reason
      .setCustomId("moderation-ban-set-reason-input")
      .setLabel("Enter a reason")
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(reason)
    );

    interaction.showModal(modal);
  },
};
