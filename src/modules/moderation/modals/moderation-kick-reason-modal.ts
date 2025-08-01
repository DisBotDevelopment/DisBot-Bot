import {MessageFlags, ModalSubmitInteraction,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
  id: "moderation-kick-reason-modal",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const uuids = interaction.customId.split(":")[1];
    const reason = interaction.fields.getTextInputValue(
      "moderation-kick-reason-input"
    );

    const cache = (client.cache.get(uuids) as { reason?: string }) || {};

    cache.reason = reason;

    if (!client.user) throw new Error("Client not found");
    interaction.reply({
      content: `## ${await convertToEmojiPng("check", client.user.id)} Reason has been set`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
