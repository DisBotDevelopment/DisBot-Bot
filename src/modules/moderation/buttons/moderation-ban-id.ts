import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "moderation-ban-id",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const modal = new ModalBuilder();
    const user = new TextInputBuilder();
    const reason = new TextInputBuilder();

    modal.setTitle("Ban a User").setCustomId("moderation-ban-id-modal");

    user
      .setCustomId("moderation-ban-set-user-input")
      .setLabel("Enter a user ID")
      .setStyle(TextInputStyle.Short)
      .setMinLength(5)
      .setRequired(true);

    reason
      .setCustomId("moderation-ban-set-reason-input")
      .setLabel("Enter a reason")
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(100)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(user),
      new ActionRowBuilder<TextInputBuilder>().addComponents(reason)
    );

    interaction.showModal(modal);
  },
};
