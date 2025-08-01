import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags,
  ModalSubmitInteraction
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";

export default {
  id: "ticket-set-button-moadl-button",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const message = await interaction.channel?.messages.fetch(
      interaction.message?.id as string
    );
    const content = message?.content.split("|");
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket-set-button-modal-title")
        .setLabel("Set the Modal Title")
        .setEmoji("<:setting:1260156922569687071>")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("ticket-set-button-modal-close")
        .setLabel("Check Data")
        .setEmoji("<:arrow:1259960970177151097>")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("ticket-set-button-modal-reset")
        .setLabel("Reset")
        .setEmoji("<:reset:1260160749481889793>")
        .setStyle(ButtonStyle.Danger)
    );

    if (!content) throw new Error("Content is not defined");

    const options = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket-set-button-modal-1")
        .setLabel("First Modal Option")
        .setEmoji("<:add:1260157236043583519>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("ticket-set-button-modal-2")
        .setLabel("Second Modal Option")
        .setEmoji("<:add:1260157236043583519>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("ticket-set-button-modal-3")
        .setLabel("Third Modal Option")
        .setEmoji("<:add:1260157236043583519>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("ticket-set-button-modal-4")
        .setLabel("Fourth Modal Option")
        .setEmoji("<:add:1260157236043583519>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("ticket-set-button-modal-5")
        .setLabel("Fifth Modal Option")
        .setEmoji("<:add:1260157236043583519>")
        .setStyle(ButtonStyle.Secondary)
    );

    if (!client.user) throw new Error("Client is not defined");

    let arrow;
    await convertToEmojiPng("arrow", client.user?.id).then((result: any) => {
      arrow = result;
    });
    interaction.reply({
      content: `${content[0]}|${content[1]}|${content[2]}`,
      embeds: [
        new EmbedBuilder()
          .setDescription(`## ${arrow} Select the Button to Setup the Modal`)
          .setColor("#2B2D31")
      ],
      components: [buttons, options],
      flags: MessageFlags.Ephemeral
    });
  }
};
