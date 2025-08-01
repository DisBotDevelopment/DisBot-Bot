import {
  ActionRowBuilder,
  ButtonInteraction,
  GuildMember,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
  id: "join_privcy",

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

    if (!data)
      return interaction.reply({
        content: "There is no channel to rename",
        flags: MessageFlags.Ephemeral
      });

    if (!(interaction.member as GuildMember).voice.channelId)
      return interaction.reply({
        content: "You are not in a voice channel",
        flags: MessageFlags.Ephemeral
      });


    if (!client.user) throw new Error("Client not found!");

    let owner;
    await convertToEmojiPng("owner", client.user.id).then((result: any) => {
      owner = result;
    });
    if (interaction.user.id !== data.OwnerId)
      return interaction.reply({
        content: `${owner} You are not the owner of this channel or you are not in the channel`,
        flags: MessageFlags.Ephemeral
      });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("join_privcy_sec")
        .setPlaceholder("➡️ Please Select")
        .setMaxValues(1)
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel("Visible")
            .setValue("join_privcy_visible_sec")
            .setEmoji("<:1161605868522065922:1191473974660563015>")
            .setDescription("Make You Channel Visible"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Invisible")
            .setEmoji("<:1161605867427348590:1191473977240059924>")
            .setValue("join_privcy_invisible_sec")
            .setDescription("Make You Channel Invisible"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_privcy_look_sec")
            .setLabel("Look")
            .setEmoji("<:1161605685201612840:1191473998953975868>")
            .setDescription("Look your Channel"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_privcy_unlook_sec")
            .setLabel("Unlook")
            .setEmoji("<:1161605863111393352:1191475828551335956>")
            .setDescription("Unlook your Channel"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_privcy_openchat_sec")
            .setLabel("Open Chat")
            .setEmoji("<:1161605450828087346:1191474002972119121>")
            .setDescription("Open the Text Channel"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_privcy_closechat_sec")
            .setLabel("Close Chat")
            .setEmoji("<:1161605450828087346:1191474002972119121>")
            .setDescription("Close the Text Channel")
        ])
    );

    interaction.reply({ components: [row], flags: MessageFlags.Ephemeral });
  }
};
