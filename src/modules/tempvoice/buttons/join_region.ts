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
  id: "join_region",

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


    if (!client.user) throw new Error("Client not Found!");

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
        .setCustomId("join_region_sec")
        .setPlaceholder("➡️ Plesase Select")

        .setMaxValues(1)
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel("Automatic")
            .setValue("join_region_auto_sec")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Discord Choose the best Region for you"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Brazil")
            .setEmoji("<:region:1204088933236080771>")
            .setValue("join_region_brazil_sec")
            .setDescription("Choose the Brazil Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_hong_kong_sec")
            .setLabel("Hong Kong")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the Hong Kong Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_india_sec")
            .setLabel("India")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the India Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_japan_sec")
            .setLabel("Japan")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the Japan Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region__sec")
            .setLabel("Rotterdam")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the Rotterdam Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_russia_sec")
            .setLabel("Russia")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the Russia Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_singapore_sec")
            .setLabel("Singapore")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the Singapore Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_south_africa_sec")
            .setLabel("South Africa")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the South Africa Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_sydney_sec")
            .setLabel("Sydney")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the Sydney Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_us_central_sec")
            .setLabel("US Central")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the US Central Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_us_east_sec")
            .setLabel("US East")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the Russia Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_us_south_sec")
            .setLabel("US South")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the US South Region"),

          new StringSelectMenuOptionBuilder()
            .setValue("join_region_us_west_sec")
            .setLabel("US West")
            .setEmoji("<:region:1204088933236080771>")
            .setDescription("Choose the US West Region")
        ])
    );

    interaction.reply({ components: [row], flags: MessageFlags.Ephemeral });
  }
};
