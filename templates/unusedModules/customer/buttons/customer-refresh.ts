// import axios from "axios";
// import {ButtonInteraction, EmbedBuilder, MessageFlags, TextInputStyle} from "discord.js";
// import {customerDB} from "../../../schema/customerDB.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   id: "customer-refresh",
//
//   /**
//    *
//    * @param {ButtonInteraction} interaction
//    * @param {ExtendedClient} client
//    */
//   async execute(interaction: ButtonInteraction, client: ExtendedClient) {
//     const customer = await customerDB.findOne({
//       UserID: interaction.user.id,
//       UUID: interaction.message.embeds[0].footer?.text
//     });
//
//     if (!customer) {
//       return interaction.reply({
//         content: "You don't have a customer profile.",
//         flags: MessageFlags.Ephemeral
//       });
//     }
//     const resources = await axios.get(
//       `${process.env.PELICAN_CLIENT_API}/servers/${customer?.RealUUID}/resources`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PELICAN_CLIENT_API_TOKEN}`,
//         },
//       }
//     );
//
//     const data = resources.data.attributes
//
//     let status
//
//     if (data.current_state == "starting") status = "<a:loading:1199076035354968194>";
//     if (data.current_state == "stopping") status = "<:DND:1199611374733635584>";
//     if (data.current_state == "running") status = "<:Online:1199395659262984283>";
//     if (data.current_state == "offline") status = "<:Offline:1199395686731493447>";
//
//     const embed = new EmbedBuilder()
//       .setTitle("DisBot Customer - Overview")
//       .setAuthor({
//         name: interaction.user.tag,
//         iconURL: interaction.user.displayAvatarURL(),
//       })
//       .setURL(
//         `https://discord.com/oauth2/authorize?client_id=${customer?.Application}&permissions=8&scope=bot+applications.commands`
//       )
//       .setColor("#2B2D31")
//       .setDescription(
//         [
//           `> **Application ID:** \`${customer?.Application}\``,
//           `> **Name:** \`${customer?.DisplayName ? customer.DisplayName : "None"
//           }\``,
//           `> **UUID:** \`${customer?.ExternalUUID}\``,
//           `> **Status**: ${status}`,
//           `> **CPU**: \`${Math.floor(data.resources.cpu_absolute)}%\``,
//           `> **Ram**: \`${Math.floor(
//             data.resources.cpu_absolute / 1000000
//           )}/500 MB\``,
//           `> **Server Uptime**: \`${Math.floor(
//             (Date.now() - new Date(data.resources.uptime).getTime()) / 1000)
//           }s\``,
//           `> **Customer API URL**: http://disbot1.server.nexospace.cloud:${customer?.ServerPort}`,
//           `> **Customer WebSocket URL**: ws://disbot1.server.nexospace.cloud:${customer?.WSAPI}`,
//         ].join("\n")
//       )
//
//     interaction.update(
//       { embeds: [embed] }
//     );
//   }
// };
