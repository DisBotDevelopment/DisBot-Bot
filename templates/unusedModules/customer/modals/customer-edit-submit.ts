// import axios from "axios";
// import {ModalSubmitInteraction} from "discord.js";
// import {customerDB} from "../../../schema/customerDB.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   id: "customer-edit-submit",
//
//   /**
//    *
//    * @param {ModalSubmitInteraction} interaction
//    * @param {Client} client
//    */
//
//   async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
//     if (!interaction.message)
//       throw new Error("Interaction message is not there");
//
//     const data = await customerDB.findOne({
//       UserID: interaction.user.id,
//       UUID: interaction.message.embeds[0].footer?.text as string
//     });
//
//     const botid = interaction.fields.getTextInputValue("customer-edit-botid");
//     const token = interaction.fields.getTextInputValue("customer-edit-token");
//
//     await customerDB.findOneAndUpdate(
//       {
//         UserID: interaction.user.id,
//         UUID: interaction.message.embeds[0].footer?.text
//       },
//
//       {
//         Application: botid
//       }
//     );
//
//     await axios.put(
//       `${process.env.PELICAN_CLIENT_API}/servers/${data?.RealUUID}/startup/variable`,
//       {
//         key: "TOKEN",
//         value: token
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PELICAN_CLIENT_API_TOKEN}`
//         }
//       }
//     );
//
//     await axios.put(
//       `${process.env.PELICAN_CLIENT_API}/servers/${data?.RealUUID}/startup/variable`,
//       {
//         key: "APPLICATIONID",
//         value: botid
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PELICAN_CLIENT_API_TOKEN}`
//         }
//       }
//     );
//
//     interaction.deferUpdate();
//   }
// };
