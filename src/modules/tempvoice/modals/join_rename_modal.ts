import {EmbedBuilder, GuildMember, MessageFlags, ModalSubmitInteraction, VoiceChannel} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "join_rename_modal",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const name = interaction.fields.getTextInputValue("vc_channelname");

    const embedhasabot = new EmbedBuilder().setDescription(
      [
        ``,
        `### <:update:1191379838880186388> You Channel has been updated!`,
        ``
      ].join("\n")
    );

    const guild = client.guilds.cache.get(interaction.guildId as string);

    const channel = guild?.channels.cache.get(
      (interaction.member as GuildMember).voice.channelId as string
    );

    (channel as VoiceChannel).setName(name);

    interaction.reply({
      embeds: [embedhasabot],
       flags: MessageFlags.Ephemeral
    });
  }
};
