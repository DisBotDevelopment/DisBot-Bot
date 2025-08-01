// import axios from "axios";
// import {ButtonInteraction, ButtonStyle, MessageFlags, TextInputStyle} from "discord.js";
// import {customerDB} from "../../../schema/customerDB.js";
// import {ExtendedClient} from "../../../types/client.js";
// import {convertToEmojiPng} from "../../../helper/emojis.js";
//
// export default {
//   id: "customer-delete",
//
//   /**
//    *
//    * @param {ButtonInteraction} interaction
//    * @param {ExtendedClient} client
//    */
//   async execute(interaction: ButtonInteraction, client: ExtendedClient) {
//     const data = await customerDB.findOne({
//       UserID: interaction.user.id,
//       UUID: interaction.message.embeds[0].footer?.text
//     });
//
//
//     const server = await axios.get(
//       `${process.env.PELICAN_APPLICATION_API}/servers/external/${data?.ExternalUUID}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PELICAN_API}`
//         }
//       }
//     )
//
//     const serverData = server.data.attributes;
//
//     await axios.delete(
//       `${process.env.PELICAN_APPLICATION_API}/servers/${serverData.id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PELICAN_API}`
//         }
//       }
//     );
//
//     await customerDB.findOneAndDelete({
//       UserID: interaction.user.id,
//       UUID: interaction.message.embeds[0].footer?.text
//     });
//
//     if (!client.user) return;
//     interaction.update({
//       content: `## ${await convertToEmojiPng("check", client.user?.id)} Your server has been deleted successfully.`,
//       embeds: [],
//       components: [],
//     });
//   }
// }
