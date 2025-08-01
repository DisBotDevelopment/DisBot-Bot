import {
    ActionRowBuilder,
    ButtonInteraction,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "reactionroles-create",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const embed = new EmbedBuilder()
      .setTitle("Create Reaction Role")
      .setDescription(
        "Create a Reaction Role by providing the following information"
      )
      .setColor("#2B2D31");

    const modal = new ModalBuilder();
    const messageURL = new TextInputBuilder();
    const message = new TextInputBuilder();
    const removemessage = new TextInputBuilder();

    modal
      .setTitle("Create Reaction Role")
      .setCustomId("reactionroles-create-modal");

    messageURL
      .setCustomId("reactionroles-create-messageurl")
      .setPlaceholder("Provide a message URL to listen for reactions")
      .setLabel("Message URL")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    message
      .setCustomId("reactionroles-create-addmessage")
      .setPlaceholder(
        "[Message is Ephermal] Provide a message to send when the user reacts"
      )
      .setLabel("Role add Message")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    removemessage
      .setCustomId("reactionroles-create-removemessage")
      .setPlaceholder(
        "[Message is Ephermal] Provide a message to send when the user reacts"
      )
      .setLabel("Role remove Message")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(messageURL),
      new ActionRowBuilder<TextInputBuilder>().addComponents(message),
      new ActionRowBuilder<TextInputBuilder>().addComponents(removemessage)
    );

    interaction.showModal(modal);
  }
};
