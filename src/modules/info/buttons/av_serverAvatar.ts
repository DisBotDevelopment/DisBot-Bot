import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "av_serverAvatar",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const { guild, member, channel } = interaction;

    await interaction.deferReply({  flags: MessageFlags.Ephemeral });

    const jsonembed = interaction.message.embeds[0].footer?.text;

    const avatarmember = guild?.members.cache.get(jsonembed as string);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("PNG")
        .setStyle(ButtonStyle.Link)
        .setURL(
          avatarmember?.displayAvatarURL({
            extension: "png",
            size: 512
          }) as string
        ),

      new ButtonBuilder()
        .setLabel("JPEG")
        .setStyle(ButtonStyle.Link)
        .setURL(
          avatarmember?.displayAvatarURL({
            extension: "jpeg",
            size: 512
          }) as string
        ),
      new ButtonBuilder()
        .setLabel("JPG")
        .setStyle(ButtonStyle.Link)
        .setURL(
          avatarmember?.displayAvatarURL({
            extension: "jpg",
            size: 512
          }) as string
        ),
      new ButtonBuilder()
        .setLabel("GIF")
        .setStyle(ButtonStyle.Link)
        .setURL(
          avatarmember?.displayAvatarURL({
            extension: "gif",
            size: 512
          }) as string
        ),
      new ButtonBuilder()
        .setLabel("WEBP")
        .setStyle(ButtonStyle.Link)
        .setURL(
          avatarmember?.displayAvatarURL({
            extension: "webp",
            size: 512
          }) as string
        )
    );
    interaction.followUp({
      embeds: [
        new EmbedBuilder().setDescription("Server Avatar").setImage(
          avatarmember?.displayAvatarURL({
            extension: "png",
            size: 512
          }) as string
        )
      ],
      components: [row],
       flags: MessageFlags.Ephemeral
    });
  }
};
