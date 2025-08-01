import {ButtonInteraction, Client, EmbedBuilder} from "discord.js";

export default {
  id: "ticket-send-button",

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction: ButtonInteraction, client: Client) {
    const message = await interaction.channel?.messages.fetch(
      interaction.message.id
    );

    const embed = message?.embeds[0].data;

    const embedjson = JSON.stringify(embed);

    const embeddata = embedjson;

    const embedbuilder = new EmbedBuilder(JSON.parse(embeddata));

    await message?.edit({
      embeds: [embedbuilder],
      components: [],
    });
    interaction.deferUpdate();
  },
};
