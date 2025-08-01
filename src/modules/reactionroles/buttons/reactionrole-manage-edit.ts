import { ActionRowBuilder, ButtonInteraction, MessageFlags, RoleSelectMenuBuilder, TextInputStyle } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
  id: "reactionrole-manage-edit",

  /**
   * @param {ButtonInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const uuid = interaction.customId.split(":")[1];

    const rolesec = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId("reactionrole-manage-roles:" + uuid)
        .setPlaceholder("Select the roles")
        .setMinValues(1)
        .setMaxValues(25)
    );

    const nextEmbed = await database.reactionRoles.findFirst({
      where: {
        GuildId: interaction.guild?.id,
        UUID: uuid
      }
    });

    if (!nextEmbed) {
      if (!client.user) throw new Error("Client user is not defined");
      return interaction.reply({
        content: `## ${await convertToEmojiPng("error", client.user?.id)} The reaction-role with the UUID \`${uuid}\` does not exist`,
        flags: MessageFlags.Ephemeral
      });
    }

    if (!client.user) throw new Error("Client user is not defined");
    interaction.reply({
      content: `## ${await convertToEmojiPng("edit", client.user?.id)} Please select the roles you want to add to the reaction-role`,
      components: [rolesec],
      flags: MessageFlags.Ephemeral
    });
  }
};
