import {ButtonInteraction, EmbedBuilder} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";

export default {
  id: "ticket-edit-button",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const message = await interaction.channel?.messages.fetch(
      interaction.message.id
    );

    const embed = message?.embeds[0].data;

    const messagecontent = message?.content.split(",");

    if (!messagecontent) throw new Error("Message content not found");

    const messageid = messagecontent[1];
    const updatemessage = await interaction.channel?.messages.fetch(messageid);

    const newEmbed = new EmbedBuilder(embed);
    updatemessage?.edit({ embeds: [newEmbed] });

    await message?.delete();
    interaction.deferUpdate();
  }
};
