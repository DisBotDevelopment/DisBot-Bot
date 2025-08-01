import {ActionRowBuilder, ButtonInteraction, ChannelSelectMenuBuilder, ChannelType, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";

export default {
  id: "button-ticket-close-archive-move",

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents([
      new ChannelSelectMenuBuilder()
        .setCustomId("button-ticket-close-archive-move-select")
        .setPlaceholder("Select a category")
        .addChannelTypes(ChannelType.GuildCategory, ChannelType.GuildDirectory)
        .setMinValues(1)
        .setMaxValues(1)
    ]);

    await interaction.reply({
      content: "Select a category to move the ticket to",
      components: [row],
       flags: MessageFlags.Ephemeral
    });
  }
};
