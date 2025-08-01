// import { ModalSubmitInteraction } from "discord.js";
// import { customerDB } from "../../../schema/customerDB.js";
// import { ExtendedClient } from "../../../types/client.js";
//
// export default {
//   id: "customer-setname-submit",
//
//   async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
//     if (!interaction.message)
//       throw new Error("Interaction message is not available");
//
//     const namme = interaction.fields.getTextInputValue("customer-setname-name");
//
//     const data = await customerDB.findOne({
//       UserID: interaction.user.id,
//       UUID: interaction.message.embeds[0].footer?.text
//     });
//
//     if (!data) return interaction.reply("No data found for this user");
//
//     await customerDB.findOneAndUpdate(
//       {
//         UserID: interaction.user.id,
//         UUID: interaction.message.embeds[0].footer?.text
//       },
//       { DisplayName: namme }
//     );
//
//     interaction.deferUpdate();
//   }
// };
