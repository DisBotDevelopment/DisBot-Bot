import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";

export default {
  id: "button-ticket-close",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    if (!client.user) throw new Error("Client not Found!");

    const { guild } = interaction;
    let emoji;
    await convertToEmojiPng("trash", client.user?.id).then((result) => {
      emoji = result;
    });
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder()
        .setCustomId("button-ticket-close-save")
        .setLabel("Delete Ticket")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("button-ticket-close-archive")
        .setLabel("Archive Ticket")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("button-ticket-close-cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Primary)
    ]);
    interaction.reply({
      content: `## ${emoji} Are you sure you want to close this ticket?`,
      components: [row],
      ephemeral: false
    });
  }
};
