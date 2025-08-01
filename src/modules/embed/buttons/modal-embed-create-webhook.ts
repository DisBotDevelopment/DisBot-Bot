import {EmbedBuilder, Message, ModalSubmitInteraction, WebhookClient} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "modal-embed-create-webhook",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const message =
      (await interaction.channel?.messages.fetch()) as unknown as Message;
    const embed = message.embeds[0].data;

    const avatar = interaction.fields.getTextInputValue(
      "embed-create-webhook-options-webhook"
    );

    const webhook = new WebhookClient({ url: avatar });

    webhook.send({
      embeds: [new EmbedBuilder(embed)]
    });

    interaction.deferUpdate();
  }
};
