import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "moderation-kick-dmmessage",
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
      .setTitle("Set DM Message")
      .setCustomId("moderation-kick-dmmessage-modal:" + uuids);

    reason
      .setCustomId("moderation-kick-dmmessage-input")
      .setLabel("Enter a dmmessage")
      .setPlaceholder(
        "You {member.name} have been banned from {guild.name} for {reason} by {moderator.name}"
      )
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(1)
      .setMaxLength(1000)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(reason)
    );

    interaction.showModal(modal);
  },
};
