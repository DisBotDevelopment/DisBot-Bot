import { ButtonInteraction, ButtonStyle, EmbedBuilder, GuildMember, MessageFlags, TextInputStyle } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
  id: "join_delete",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const { guild, member } = interaction;
    const data = await database.tempVoiceChannels.findFirst({
      where: {
        GuildId: guild?.id,
        OwnerId: interaction.user.id
      }
    });

    if (!client.user) throw new Error("Client not found");

    let owner;
    await convertToEmojiPng("owner", client.user.id).then((result: any) => {
      owner = result;
    });
    let trash;
    await convertToEmojiPng("trash", client.user.id).then((result: any) => {
      trash = result;
    });

    if (!data)
      return interaction.reply({
        content: "There is no channel to rename",
        flags: MessageFlags.Ephemeral
      });

    if (!(interaction.member as GuildMember)?.voice.channelId)
      return interaction.reply({
        content: "You are not in a voice channel",
        flags: MessageFlags.Ephemeral
      });

    if (interaction.user.id !== data.OwnerId)
      return interaction.reply({
        content: `${owner} You are not the owner of this channel or you are not in the channel`,
        flags: MessageFlags.Ephemeral
      });
    const embedhasabot = new EmbedBuilder().setDescription(
      [``, `### ${trash} You Channel has been deleted!`, ``].join("\n")
    );

    const channel = interaction.guild?.channels.cache.get(
      data.ChannelId as string
    );

    channel?.delete("Channel deleted by owner");

    interaction.reply({ embeds: [embedhasabot], flags: MessageFlags.Ephemeral });
  }
};
