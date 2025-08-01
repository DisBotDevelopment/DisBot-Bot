import {ButtonInteraction, ButtonStyle, EmbedBuilder} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";

export default {
  id: "button-ticket-close-cancel",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const { guild, member, message } = interaction;

    const redEmbed = new EmbedBuilder().setColor("#FF0000");

    await interaction.message.delete();
  }
};
