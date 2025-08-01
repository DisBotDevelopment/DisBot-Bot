import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponent,
  MessageFlags,
  ModalSubmitInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "bticket-update-modal",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    try {
      const nameinput = interaction.fields.getTextInputValue(
        "bticket-update-name"
      );
      const emojiinput = interaction.fields.getTextInputValue(
        "bticket-update-emoji"
      );
      const style = interaction.fields.getTextInputValue(
        "bticket-update-style"
      );

      const uuid = interaction.customId.split(":")[1];

      let styles;
      if (style == "Primary") styles = ButtonStyle.Primary;
      else if (style == "Secondary") styles = ButtonStyle.Secondary;
      else if (style == "Success") styles = ButtonStyle.Success;
      else if (style == "Danger") styles = ButtonStyle.Danger;

      const message = await interaction.channel?.messages.fetch(
        interaction.customId.split(":")[2]
      );

      let rows = message?.components as ActionRow<MessageActionRowComponent>[];

      if (rows?.length == 0) {
        // Keine Zeilen vorhanden, erstelle eine neue Zeile mit einem Button
        let button = new ButtonBuilder()
          .setCustomId(uuid)
          .setLabel(nameinput)
          .setStyle(styles as ButtonStyle);

        if (emojiinput) {
          button.setEmoji(emojiinput);
        }

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await message?.edit({ components: [row] });
      } else {
        // Es gibt bereits Zeilen, füge den Button zur letzten Zeile hinzu oder erstelle eine neue Zeile
        let lastRow = rows[rows.length - 1];

        let button = new ButtonBuilder()
          .setCustomId(uuid)
          .setLabel(nameinput)
          .setStyle(styles as ButtonStyle);
        if (emojiinput) {
          button.setEmoji(emojiinput);
        }

        if (lastRow.components.length >= 5) {
          let newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            button
          );
          rows.push(newRow.toJSON() as ActionRow<MessageActionRowComponent>);
        } else {
          lastRow.components.push(button.toJSON() as MessageActionRowComponent);
        }

        await message?.edit({ components: rows });
      }

      interaction.reply({
        content: "## Button Updated",
         flags: MessageFlags.Ephemeral
      });
    } catch (error) {
      return interaction.reply({
        content: "## This Button is added already! Please try again",
         flags: MessageFlags.Ephemeral
      });
    }
  }
};
