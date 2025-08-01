import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  ContainerBuilder,
  MessageFlags,
  TextInputStyle,
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
  id: "messages-send",

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const uuid = interaction.customId.split(":")[1];

    const channelsec =
      new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId("messages-send-sec:" + uuid)
          .setPlaceholder("Select a Channel to send the Embed")
          .setMaxValues(1)
          .addChannelTypes(
            ChannelType.GuildText,
            ChannelType.GuildAnnouncement,
            ChannelType.PrivateThread,
            ChannelType.PublicThread,
            ChannelType.AnnouncementThread
          )
      );

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("messages-create-send-webohook:" + uuid)
        .setLabel("Use a Webhook")
        .setEmoji("<:webhook:1394012993880326335>")
        .setStyle(ButtonStyle.Secondary)
    );

    interaction.reply({
      components: [
        new ContainerBuilder().addActionRowComponents(
          channelsec,
        ).addActionRowComponents(buttons)
      ],
      flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
    });
  },
};
