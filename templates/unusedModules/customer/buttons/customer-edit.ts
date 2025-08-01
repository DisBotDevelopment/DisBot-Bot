// import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   id: "customer-edit",
//
//   /**
//    *
//    * @param {ButtonInteraction} interaction
//    * @param {ExtendedClient} client
//    */
//   async execute(interaction: ButtonInteraction, client: ExtendedClient) {
//     const modal = new ModalBuilder();
//
//     const name = new TextInputBuilder();
//     const token = new TextInputBuilder();
//
//     modal.setTitle("Edit the Bot").setCustomId("customer-edit-submit");
//
//     name
//       .setLabel("Application ID")
//
//       .setCustomId("customer-edit-botid")
//       .setStyle(TextInputStyle.Short)
//       .setPlaceholder("1423354456676")
//
//       .setRequired(true);
//     token
//       .setCustomId("customer-edit-token")
//       .setLabel("Token")
//       .setStyle(TextInputStyle.Short)
//       .setPlaceholder("NzE2MzQ5NjY4NzY4NzY4NzY4.XtJ1XQ.");
//
//     modal.addComponents(
//       new ActionRowBuilder<TextInputBuilder>().addComponents(name),
//       new ActionRowBuilder<TextInputBuilder>().addComponents(token)
//     );
//
//     interaction.showModal(modal);
//   }
// };
