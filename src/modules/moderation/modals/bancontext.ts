import {EmbedBuilder, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "bancontext",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const userid = interaction.fields.getTextInputValue("banc-userid");
    const reason = interaction.fields.getTextInputValue("banc-reason");
    const delemessages = interaction.fields.getTextInputValue("banc-messages");

    const embed = new EmbedBuilder()
      .setTitle("Member Banned")
      .setDescription(
        [`**User ID:** ${userid}`, `**Reason:** ${reason}`].join("\n")
      );

    interaction.guild?.bans.create(userid, {
      reason: reason
    });

    interaction.reply({
      embeds: [embed],
       flags: MessageFlags.Ephemeral
    });
  }
};
