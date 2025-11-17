import {ActionRowBuilder, ButtonInteraction, Message, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
  id: "editmessages-message-message",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const messageID = interaction.customId.split(":")[1];
    const message =
      (await interaction.channel?.messages.fetch()) as unknown as Message;

    const modal = new ModalBuilder();
    const content = new TextInputBuilder();

    modal
      .setTitle("Edit your message")
      .setCustomId("editmessages-message-message-modal:" + messageID);

    content
      .setLabel("Message Content")
      .setCustomId("content")
      .setStyle(TextInputStyle.Paragraph)
      .setValue(`${message.content}`)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(content)
    );

    interaction.showModal(modal);
  }
};
