import {ActionRowBuilder, ButtonInteraction, ChannelSelectMenuBuilder, ChannelType, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
  id: "twitch-update-channelname",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const uuid = interaction.customId.split(":")[1];

    const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId("twitch-edit-channel:" + uuid)
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Select your Channel/Thread")
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.PublicThread,
          ChannelType.PrivateThread,
          ChannelType.GuildAnnouncement
        )
    );

    if (!client.user) throw new Error("Client User is not defined");

    interaction.reply({
      content: `## ${await convertToEmojiPng(
        "text",
        client.user.id
      )} Please select a Channel/Thread to send the message.`,
      components: [row],
       flags: MessageFlags.Ephemeral
    });
  }
};
