import {EmbedBuilder, GuildMember, MessageFlags, ModalSubmitInteraction, VoiceChannel} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "join_limit_modal",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const limit = interaction.fields.getTextInputValue(
      "vc_channellimit"
    ) as unknown as number;

    const embedhasabot = new EmbedBuilder().setDescription(
      [
        ``,
        `### <:update:1191379838880186388> You Channel has been updated!`,
        ``
      ].join("\n")
    );

    const guild = client.guilds.cache.get(interaction.guildId as string);

    if (!interaction.member) throw new Error("No Member found.");

    const channel = guild?.channels.cache.get(
      (interaction.member as GuildMember).voice.channelId as string
    );

    if (limit > 99)
      return interaction.reply({
        content: "The limit cannot be more than 99",
         flags: MessageFlags.Ephemeral
      });

    if (limit < 0)
      return interaction.reply({
        content: "The limit cannot be less than 0",
         flags: MessageFlags.Ephemeral
      });

    if (!limit) (channel as VoiceChannel).setUserLimit(0);

    if (limit) (channel as VoiceChannel).setUserLimit(limit);

    interaction.reply({
      embeds: [embedhasabot],
       flags: MessageFlags.Ephemeral
    });
  }
};
