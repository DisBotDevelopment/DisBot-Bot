import {ActionRowBuilder, ButtonInteraction, MessageFlags, UserSelectMenuBuilder} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";

export default {
  id: "ticket-buttom-member-add",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("ticket-buttom-member-add-sec")
        .setPlaceholder("Select a member to add them to the ticket")
    );

    interaction.reply({
      content: "Please select a member to add them to the ticket",
      components: [row],
       flags: MessageFlags.Ephemeral
    });
  }
};
