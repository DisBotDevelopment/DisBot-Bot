import {MessageFlags, ModalSubmitInteraction,} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
  id: "moderation-timeout-reason-modal",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const uuids = interaction.customId.split(":")[1];
    const reason = interaction.fields.getTextInputValue(
      "moderation-timeout-reason-input"
    );

    const cache = (client.cache.get(uuids) as { reason?: string }) || {};

    cache.reason = reason;

    if (!client.user) throw new Error("Client not found");
    interaction.reply({
      content: `## ${await convertToEmojiToPng("check")} Reason has been set`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
