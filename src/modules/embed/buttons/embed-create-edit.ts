import {EmbedBuilder, TextBasedChannel, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "embed-create-edit",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    const message = await interaction.channel?.messages.fetch(
      interaction.message.id
    );

    const messagecontent = message?.content;
    const link = messagecontent?.split("/");
    if (!link) throw new Error("No link found!");

    const channel = interaction.guild?.channels.cache.get(
      link[5] as string
    ) as TextBasedChannel;

    const editmessage = await channel.messages.fetch(link[6]);
    if (!message) throw new Error("No message Found");

    const embed = new EmbedBuilder(message?.embeds[0].data);

    editmessage.edit({
      embeds: [embed]
    });

    interaction.deferUpdate();
  }
};
