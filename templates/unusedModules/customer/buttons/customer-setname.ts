// import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   id: "customer-setname",
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
//
//     modal.setTitle("Rename the Bot").setCustomId("customer-setname-submit");
//
//     name
//       .setLabel("New Name")
//
//       .setCustomId("customer-setname-name")
//       .setStyle(TextInputStyle.Short)
//       .setPlaceholder("DiscordBot#1234")
//
//       .setRequired(true);
//
//     modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(name));
//
//     interaction.showModal(modal);
//   },
// };
