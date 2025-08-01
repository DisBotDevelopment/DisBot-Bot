// import {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuInteraction} from "discord.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   id: "customer-bot-set-banner",
//
//   /**
//    * @param {UserSelectMenuInteraction} interaction
//    * @param {ExtendedClient} client
//    */
//   async execute(
//     interaction: UserSelectMenuInteraction,
//     client: ExtendedClient
//   ) {
//     const modal = new ModalBuilder();
//
//     const url = new TextInputBuilder();
//
//     modal
//       .setTitle("Set the Bot Banner")
//       .setCustomId("customer-bot-set-banner-submit");
//
//     url
//       .setCustomId("url")
//       .setLabel("Image URL")
//       .setStyle(TextInputStyle.Paragraph)
//       .setPlaceholder("https://example.com/image.png")
//       .setRequired(true);
//
//     modal.addComponents(
//       new ActionRowBuilder<TextInputBuilder>().addComponents(url)
//     );
//
//     interaction.showModal(modal);
//   }
// };
