import {Client, EmbedBuilder, TextChannel, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "embed-create-channel-sec",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    if (!interaction.channel) throw new Error("No Channel found.");
    const message = await interaction.channel.messages.fetch(
      interaction.message.id
    );

    interaction.values.forEach(async (value) => {
      if (!interaction.guild) throw new Error("No Guild found.");
      const channel = interaction.guild.channels.cache.get(value);
      const embed = message.embeds[0].data;

      const embedbuilder = new EmbedBuilder(embed);

      (channel as TextChannel).send({
        embeds: [embedbuilder]
      });

      interaction.deferUpdate();
    });
  }
};
