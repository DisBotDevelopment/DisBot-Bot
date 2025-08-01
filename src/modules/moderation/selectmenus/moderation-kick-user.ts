import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  GuildMemberRoleManager,
  MessageFlags,
  UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "moderation-kick-user",

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(
    interaction: UserSelectMenuInteraction,
    client: ExtendedClient
  ) {
    try {
      if (!client.user) throw new Error("Client is not defined");

      const uuid = interaction.customId.split(":")[1];
      interaction.values.forEach(async (value) => {
        const data = client.cache.get(uuid) as {
          reason: string;
          dmmessage: string;
        };

        const user = await interaction.guild?.members.fetch(value);

        if (!client.user) throw new Error("Client is not defined");
        if (!user) {
          return interaction.reply({
            content: `## ${await convertToEmojiPng("error", client.user?.id)} A user you selected is not in the server`,
            flags: MessageFlags.Ephemeral,
          });
        }

        if (
          ((interaction.member?.roles instanceof GuildMemberRoleManager &&
            interaction.member.roles.highest.position) ||
            0) <= user.roles.highest.position
        ) {
          return interaction.reply({
            content: `## ${await convertToEmojiPng("error", client.user?.id)} You can't ban a user with a higher or equal role`,
            flags: MessageFlags.Ephemeral,
          });
        }

        try {
          if (data?.dmmessage)
            await user.send({
              content: data?.dmmessage
                .replace("{member.name}", user.user.tag)
                .replace("{member.name}", user.user.username)
                .replace("{member.tag}", `<@${user.id}>`)
                .replace("{member.id}", user.id)
                .replace("{guild.name}", interaction.guild?.name as string)
                .replace("{guild.id}", interaction.guild?.id as string)
                .replace("{reason}", data?.reason ?? "No reason provided")
                .replace("{moderator.tag}", `<@${interaction.user.id}>`)
                .replace("{moderator.id}", interaction.user.id)
                .replace("{moderator.name}", interaction.user.username),
              components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel(
                      "Server: " +
                        interaction.guild?.name +
                        " (" +
                        interaction.guild?.id +
                        ")"
                    )
                    .setURL(
                      interaction.guild?.vanityURLCode
                        ? "https://discord.gg/" +
                            interaction.guild?.vanityURLCode
                        : "https://No-Vanity-URL.com"
                    )
                ),
              ],
            });
        } catch (error) {
          throw new Error(error as string);
        }

        await user.kick(data?.reason ?? "No reason provided");
      });
      interaction.update({
        content: `## ${await convertToEmojiPng(
          "check",
          client.user.id
        )} Successfully kicked the user(s)`,
        components: [],
      });
    } catch (error) {
      if (!client.user) throw new Error("Client is not defined");
      return interaction.reply({
        content: `## ${await convertToEmojiPng("error", client.user?.id)} Check the permoissions and try again or ban the user manually (one by one)`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
