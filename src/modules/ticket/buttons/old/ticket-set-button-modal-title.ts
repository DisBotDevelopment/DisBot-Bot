import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";

export default {
  id: "ticket-set-button-modal-title",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const message = await interaction.channel?.messages.fetch(
      interaction.message.id
    );
    const content = message?.content.split("|");

    const modal = new ModalBuilder();

    const name = new TextInputBuilder();
    const messageid = new TextInputBuilder();
    const uuid = new TextInputBuilder();

    if (!content) throw new Error("Message content not found!");

    modal.setTitle("Name of the Menu").setCustomId("ticket-button-modal-title");

    name
      .setLabel("Name")

      .setCustomId("ticket-menu-modal-title-name")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Name of the Menu")
      .setValue("Why you open a Ticket?")
      .setRequired(true);

    messageid
      .setLabel("MessageID")
      .setCustomId("ticket-menu-modal-title-messageid")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("NOT CHANGE THIS")
      .setValue(content[1])
      .setRequired(true);

    uuid
      .setLabel("UUID")
      .setCustomId("ticket-menu-modal-title-uuid")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("NOT CHANGE THIS")
      .setValue(content[2])
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(name),
      new ActionRowBuilder<TextInputBuilder>().addComponents(messageid),
      new ActionRowBuilder<TextInputBuilder>().addComponents(uuid)
    );

    interaction.showModal(modal);
  }
};
