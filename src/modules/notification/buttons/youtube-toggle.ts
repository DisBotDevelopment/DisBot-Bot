import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, TextInputStyle } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
  id: "youtube-toggle",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    if (!client.user) throw new Error("Client User is not defined");

    const youtubeData = await database.guildFeatureToggles.findFirst({
      where: {
        GuildId: interaction.guild.id
      }
    });
    if (!youtubeData) {
      await database.guildFeatureToggles.create({
        data: {
          GuildId: interaction.guild?.id,
          YoutubeEnabled: true
        }
      });

    }

    if (youtubeData?.YoutubeEnabled) {
      await database.guildFeatureToggles.update(
        {
          where: { GuildId: interaction.guild?.id },
          data: { YoutubeEnabled: false }
        }
      );
    } else {
      await database.guildFeatureToggles.update(
        {
          where: { GuildId: interaction.guild?.id },
          data: { YoutubeEnabled: true }
        }
      );
    }

    const enabled = youtubeData?.YoutubeEnabled == true ? true : false;

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("youtube-toggle")
        .setLabel("Enable Youtube Notifications")
        .setEmoji(
          enabled == true
            ? "<:toggleoff:1301864526848987196>"
            : "<:toggleon:1301864515838672908>"
        )
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("youtube-add-channelname")
        .setLabel("Add a Youtube Channel")
        .setEmoji("<:add:1260157236043583519>")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("youtube-manage")
        .setEmoji("<:setting:1260156922569687071>")
        .setLabel("Manage Youtube Channels")
        .setStyle(ButtonStyle.Secondary)
    );

    interaction.update({
      content: `## ${await convertToEmojiPng("check", client.user?.id)} Youtube Notifications are now ${enabled == true ? "enabled" : "disabled"}!`,
      components: [row]
    });
  }
};
