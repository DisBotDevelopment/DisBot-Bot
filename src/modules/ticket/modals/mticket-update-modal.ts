import {
  ActionRow,
  ActionRowBuilder,
  APIActionRowComponent,
  ButtonStyle,
  MessageActionRowComponent,
  MessageFlags,
  ModalSubmitInteraction,
  StringSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "mticket-update-modal",

  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {ExtendedClient} client
   */

  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    const nameinput = interaction.fields.getTextInputValue(
      "mticket-update-name"
    );
    const descriptioninput = interaction.fields.getTextInputValue(
      "mticket-update-description"
    );
    const emojiinput = interaction.fields.getTextInputValue(
      "mticket-update-emoji"
    );

    const placeholder = interaction.fields.getTextInputValue(
      "mticket-update-placeholder"
    );

    const message = await interaction.channel?.messages.fetch(
      interaction.customId.split(":")[2]
    );

    let rows = message?.components as ActionRow<MessageActionRowComponent>[];

    let menu = new StringSelectMenuBuilder()
      .setCustomId("ticket-selectmenu")
      .setPlaceholder(placeholder || "Select an option");

    if (rows?.length == 0) {
      let option = {
        label: nameinput,
        value: interaction.customId.split(":")[1],
        description: descriptioninput || undefined,
        emoji: emojiinput || undefined
      };

      menu.addOptions(option);

      let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        menu
      );
      rows.push(row as unknown as ActionRow<MessageActionRowComponent>);
      await message?.edit({ components: rows.map((row) => row.toJSON()) });
    } else {
      let rows = message?.components.map((component) => {
        return ActionRowBuilder.from(component as APIActionRowComponent<any>) as unknown as ActionRow<MessageActionRowComponent>;
      });
      if (!rows) {
        return;
      }
      let lastRow = rows[(rows.length as number) - 1];
      let lastMenu = lastRow.components[lastRow.components.length - 1];

      let option = {
        label: nameinput,
        value: interaction.customId.split(":")[1],
        description: descriptioninput || undefined,
        emoji: emojiinput || undefined
      };

      if (
        lastMenu instanceof StringSelectMenuBuilder &&
        lastMenu.options.length < 25
      ) {
        // Fügen Sie die Option zum letzten Menü hinzu
        lastMenu.addOptions([option]);
      } else {
        // Wenn das letzte Menü voll ist oder nicht existiert, erstellen Sie ein neues Menü und fügen Sie es einer neuen oder bestehenden Zeile hinzu
        const newMenu = new StringSelectMenuBuilder()
          .setCustomId(`menu-${Date.now()}`)
          .setPlaceholder("Wähle eine Option")
          .addOptions([option]);

        if (!lastRow || lastRow.components.length === 5) {
          // Erstellen Sie eine neue Zeile, wenn die letzte Zeile voll ist oder nicht existiert
          lastRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              newMenu
            ) as unknown as ActionRow<MessageActionRowComponent>;
          rows?.push(lastRow);
        } else {
          // Fügen Sie das neue Menü der letzten Zeile hinzu
          lastRow.components.push(
            newMenu.toJSON() as unknown as MessageActionRowComponent
          ) as unknown as ActionRow<MessageActionRowComponent>;
        }
      }

      // Aktualisieren Sie die Nachricht mit den aktualisierten rows
      await message?.edit({ components: rows.map((row) => row.toJSON()) });
    }

    await interaction.reply({
      content: "## Option added successfully!",
      flags: MessageFlags.Ephemeral
    });
  }
};
