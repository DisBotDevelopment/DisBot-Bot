// import {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuInteraction} from "discord.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   id: "customer-bot-set-status",
//
//   /**
//    * @param {UserSelectMenuInteraction} interaction
//    * @param {ExtendedClient} client
//    */
//   async execute(interaction: UserSelectMenuInteraction, client: ExtendedClient) {
//     const modal = new ModalBuilder();
//
//     const text = new TextInputBuilder();
//     const type = new TextInputBuilder();
//     const status = new TextInputBuilder();
//     const url = new TextInputBuilder();
//
//     modal
//       .setTitle("Set the Bot Status")
//       .setCustomId("customer-bot-set-status-submit");
//
//     text
//       .setCustomId("text")
//       .setLabel("Set the Status Text")
//       .setStyle(TextInputStyle.Short)
//       .setMinLength(2)
//       .setMaxLength(25)
//       .setPlaceholder("Hello World")
//       .setRequired(true);
//
//     type
//       .setCustomId("type")
//       .setLabel("Set the Status Type")
//       .setMinLength(6)
//       .setMaxLength(10)
//       .setStyle(TextInputStyle.Short)
//       .setPlaceholder("Playing, Listening, Watching, Streaming, Custom")
//       .setRequired(true);
//
//     status
//       .setCustomId("status")
//       .setLabel("Set the Status")
//       .setMinLength(4)
//       .setMaxLength(15)
//       .setStyle(TextInputStyle.Short)
//       .setPlaceholder("Online, Idle, DoNotDisturb, Offline")
//       .setRequired(true);
//
//     url
//       .setCustomId("url")
//       .setLabel("Set the URL")
//       .setStyle(TextInputStyle.Short)
//       .setPlaceholder(
//         "[Only used by Streaming] - https://www.twitch.tv/username"
//       )
//       .setRequired(false);
//
//     modal.addComponents(
//       new ActionRowBuilder<TextInputBuilder>().addComponents(text),
//       new ActionRowBuilder<TextInputBuilder>().addComponents(type),
//       new ActionRowBuilder<TextInputBuilder>().addComponents(status),
//       new ActionRowBuilder<TextInputBuilder>().addComponents(url)
//     );
//
//     interaction.showModal(modal);
//   },
// };
