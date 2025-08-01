import {MessageFlags, ModalSubmitInteraction,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
  id: "moderation-ban-id-modal",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const user = interaction.fields.getTextInputValue(
      "moderation-ban-set-user-input"
    );
    const reason =
      interaction.fields.getTextInputValue("moderation-ban-set-reason-input") ??
      "No reason provided";

    await interaction.guild?.members.ban(user, { reason: reason });

    if (!client.user) throw new Error("Client not found");
    interaction.reply({
      content: `## ${await convertToEmojiPng("check", client.user?.id)} User has been banned`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
