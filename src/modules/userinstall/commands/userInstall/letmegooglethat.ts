import {
  ApplicationIntegrationType,
  ChannelType,
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder
} from "discord.js";
import { ExtendedClient } from "types/client.js";

export default {
  data: new SlashCommandBuilder()
    .setName("let-me-google-that-for-you")
    .setDescription("Use the pupular tool 'Let me google that for you'")
    .setDescriptionLocalizations({
      de: "Benutze das beliebte Tool 'Let me google that for you'"
    })
    .setContexts([
      InteractionContextType.PrivateChannel,
      InteractionContextType.Guild
    ])
    .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
    .addStringOption((option) =>
      option
        .setName("promt")
        .setDescription("The search query")
        .setDescriptionLocalizations({
          de: "Die Suchanfrage"
        })
        .setRequired(true)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient
  ) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });
    const query = interaction.options.getString("promt");

    await interaction.editReply({
      content: `https://letmegooglethat.com//?q=${encodeURIComponent(query as string)}`
    });
  }
};
