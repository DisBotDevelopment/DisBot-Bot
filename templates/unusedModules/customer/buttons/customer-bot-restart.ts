// import axios from "axios";
// import {MessageFlags, UserSelectMenuInteraction} from "discord.js";
// import {customerDB} from "../../../schema/customerDB.js";
// import {ExtendedClient} from "../../../types/client.js";
// import "dotenv/config";
// import {convertToEmojiPng} from "../../../helper/emojis.js";
//
// export default {
//   id: "customer-bot-restart",
//
//   /**
//    * @param {UserSelectMenuInteraction} interaction
//    * @param {ExtendedClient} client
//    */
//
//   async execute(interaction: UserSelectMenuInteraction, client: ExtendedClient) {
//     const data = await customerDB.findOne({
//       UserID: interaction.user.id,
//       Application: client.user?.id
//     });
//
//     const restart = await axios.post(
//       `${process.env.PELICAN_CLIENT_API}/servers/${data?.RealUUID}/power`,
//       {
//         signal: "restart"
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.CUSTOMER_API_KEY}`
//         }
//       }
//     );
//
//     if (!client.user) return;
//     if (restart.status != 200) {
//       interaction.reply({
//         content: `## ${convertToEmojiPng("error", client.user?.id)} There was an error restarting your server. Please try again later.`,
//         flags: MessageFlags.Ephemeral
//       });
//     }
//
//     interaction.deferUpdate();
//   }
// };
