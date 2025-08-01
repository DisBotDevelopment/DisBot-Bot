import {ButtonStyle, Client, MessageFlags, Role, TextChannel, UserSelectMenuInteraction} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "join_privcy_sec",

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
      const member = interaction.guild?.members.cache.get(interaction.user.id);

      const channel = interaction.guild?.channels.cache.get(
        member?.voice.channelId as string
      );

      switch (value) {
        case "join_privcy_visible_sec": {
          if (interaction?.guild?.roles?.everyone) {
            (channel as TextChannel).permissionOverwrites.delete(
              interaction.guild.roles.everyone
            );
          }

          interaction.editReply({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel to Visible`
          });

          break;
        }

        case "join_privcy_invisible_sec": {
          if (interaction.guild?.roles.everyone) {
            (channel as TextChannel).permissionOverwrites.edit(
              interaction.guild.roles.everyone,
              {
                ViewChannel: false
              }
            );
          }
          interaction.editReply({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have successfully set the Channel to Invisible`
          });

          break;
        }

        case "join_privcy_look_sec": {
          (channel as TextChannel).permissionOverwrites.edit(
            interaction.guild?.roles.everyone as Role,
            {
              Connect: false,
              SendMessages: false
            }
          );
          interaction.editReply({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have looked the Channel`
          });

          break;
        }

        case "join_privcy_unlook_sec": {
          if (interaction.guild) {
            (channel as TextChannel).permissionOverwrites.delete(
              interaction.guild.roles.everyone
            );
          }
          interaction.editReply({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} You have unlooked the Channel`
          });

          break;
        }
        case "join_privcy_openchat_sec": {
          if (!interaction.guild) throw new Error("No Guild found.");
          (channel as TextChannel).permissionOverwrites.delete(
            interaction.guild.roles.everyone
          );
          interaction.editReply({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} The Text Channel is now open`
          });

          break;
        }

        case "join_privcy_closechat_sec": {
          if (!interaction.guild) throw new Error("No Guild found.");
          (channel as TextChannel).permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
              SendMessages: false
            }
          );
          interaction.editReply({
            content: `## ${await convertToEmojiPng(
              "check",
              client.user.id
            )} The Text Channel is now closed`
          });

          break;
        }
      }
    });
  }
};
