import {
  ActionRowBuilder,
  ButtonInteraction,
  Client,
  GuildMember,
  MessageFlags,
  UserSelectMenuBuilder
} from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
  id: "join_kick",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction: ButtonInteraction, client: Client) {
    const { guild, member } = interaction as ButtonInteraction;

    if (!guild) {
      return interaction.reply({
        content: "Guild not found",
        flags: MessageFlags.Ephemeral
      });
    }

    if (!interaction.member) {
      return interaction.reply({
        content: "Member not found",
        flags: MessageFlags.Ephemeral
      });
    }

    const data = await database.tempVoiceChannels.findFirst({
      where: {
        GuildId: guild?.id,
        OwnerId: interaction.user.id
      }
    });

    if (!data)
      return interaction.reply({
        content: "There is no channel to rename",
        flags: MessageFlags.Ephemeral
      });

    if (
      !interaction.member ||
      !(interaction.member as GuildMember).voice.channelId
    )
      return interaction.reply({
        content: "You are not in a voice channel",
        flags: MessageFlags.Ephemeral
      });

    let owner;
    if (!client.user) {
      return interaction.reply({
        content: "Client user not found",
        flags: MessageFlags.Ephemeral
      });
    }
    await convertToEmojiPng("owner", client.user.id).then((result: any) => {
      owner = result;
    });
    if ((interaction.member as GuildMember).id !== data.OwnerId)
      return interaction.reply({
        content: `${owner} You are not the owner of this channel or you are not in the channel`,
        flags: MessageFlags.Ephemeral
      });

    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("join_kick_sec")
        .setPlaceholder("➡️ Please Select")
        .setMaxValues(1)
    );

    interaction.reply({ components: [row], flags: MessageFlags.Ephemeral });
  }
};
