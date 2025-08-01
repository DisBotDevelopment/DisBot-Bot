import {ButtonStyle, Client, MessageFlags, UserSelectMenuInteraction, VoiceChannel} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "join_region_sec",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    await interaction.deferReply({  flags: MessageFlags.Ephemeral });

    interaction.values.forEach(async (value) => {
      if (!interaction.guild) throw new Error("No Guild found.");
      const member = interaction.guild.members.cache.get(interaction.user.id);

      const channel = interaction.guild.channels.cache.get(
        member?.voice.channelId as string
      );

      switch (value) {
        case "join_region_auto_sec": {
          (channel as VoiceChannel).setRTCRegion(null);
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )}  You have successfully set the Channel Region to Automatic`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_brazil_sec": {
          (channel as VoiceChannel).setRTCRegion("brazil");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to Brazil`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_hong_kong_sec": {
          (channel as VoiceChannel).setRTCRegion("hongkong");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to Hong Kong`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_india_sec": {
          (channel as VoiceChannel).setRTCRegion("india");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to India`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_japan_sec": {
          (channel as VoiceChannel).setRTCRegion("japan");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to Japan`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_rotterdam_sec": {
          (channel as VoiceChannel).setRTCRegion("rotterdam");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to Rotterdam`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_russia_sec": {
          (channel as VoiceChannel).setRTCRegion("russia");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to Russia`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_singapore_sec": {
          (channel as VoiceChannel).setRTCRegion("singapore");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to Singapore`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_sydney_sec": {
          (channel as VoiceChannel).setRTCRegion("sydney");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to Sydney`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_us_central_sec": {
          (channel as VoiceChannel).setRTCRegion("us-central");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to US Central`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_us_east_sec": {
          (channel as VoiceChannel).setRTCRegion("us-east");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to US East`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_us_south_sec": {
          (channel as VoiceChannel).setRTCRegion("us-south");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to US South`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_south_africa_sec": {
          (channel as VoiceChannel).setRTCRegion("south-africa");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to South Africa`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }

        case "join_region_us_west_sec": {
          (channel as VoiceChannel).setRTCRegion("us-west");
          interaction.followUp({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel Region to US West`,
             flags: MessageFlags.Ephemeral
          });

          break;
        }
      }
    });
  }
};
