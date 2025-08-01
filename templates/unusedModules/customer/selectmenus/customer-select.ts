// import "dotenv/config";
// import axios from "axios";
// import {
//   ActionRowBuilder,
//   ButtonBuilder,
//   ButtonStyle,
//   EmbedBuilder,
//   MessageFlags,
//   StringSelectMenuInteraction,
// } from "discord.js";
// import { customerDB } from "../../../schema/customerDB.js";
// import { ExtendedClient } from "../../../types/client.js";
//
// export default {
//   id: "customer-select",
//
//   async execute(
//     interaction: StringSelectMenuInteraction,
//     client: ExtendedClient
//   ) {
//     interaction.values.forEach(async (value) => {
//       const customer = await customerDB.findOne({
//         UserID: interaction.user.id,
//         UUID: value,
//       });
//
//       if (!customer) {
//         return interaction.reply({
//           content: "You don't have a customer profile.",
//           flags: MessageFlags.Ephemeral
//         });
//       }
//       const resources = await axios.get(
//         `${process.env.PELICAN_CLIENT_API}/servers/${customer?.RealUUID}/resources`,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.PELICAN_CLIENT_API_TOKEN}`,
//           },
//         }
//       );
//
//       const data = resources.data.attributes
//
//       let status
//
//       if (data.current_state == "starting") status = "<a:loading:1199076035354968194>";
//       if (data.current_state == "stopping") status = "<:DND:1199611374733635584>";
//       if (data.current_state == "running") status = "<:Online:1199395659262984283>";
//       if (data.current_state == "offline") status = "<:Offline:1199395686731493447>";
//
//       const embed = new EmbedBuilder()
//         .setTitle("DisBot Customer - Overview")
//         .setAuthor({
//           name: interaction.user.tag,
//           iconURL: interaction.user.displayAvatarURL(),
//         })
//         .setURL(
//           `https://discord.com/oauth2/authorize?client_id=${customer?.Application}&permissions=8&scope=bot+applications.commands`
//         )
//         .setColor("#2B2D31")
//         .setDescription(
//           [
//             `> **Application ID:** \`${customer?.Application}\``,
//             `> **Name:** \`${customer?.DisplayName ? customer.DisplayName : "None"
//             }\``,
//             `> **UUID:** \`${customer?.ExternalUUID}\``,
//             `> **Status**: ${status}`,
//             `> **CPU**: \`${Math.floor(data.resources.cpu_absolute)}%\``,
//             `> **Ram**: \`${Math.floor(
//               data.resources.cpu_absolute / 1000000
//             )}/500 MB\``,
//             `> **Server Uptime**: \`${Math.floor(
//               (Date.now() - new Date(data.resources.uptime).getTime()) / 1000)
//             }s\``,
//             `> **Customer API URL**: http://disbot1.server.nexospace.cloud:${customer?.ServerPort}`,
//             `> **Customer WebSocket URL**: ws://disbot1.server.nexospace.cloud:${customer?.WSAPI}`,
//           ].join("\n")
//         )
//
//       const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
//         new ButtonBuilder()
//           .setCustomId("customer-start")
//           .setLabel("Start")
//           .setStyle(ButtonStyle.Success)
//           .setEmoji("<:play:1259859761285955656>")
//           .setDisabled(false),
//         new ButtonBuilder()
//           .setCustomId("customer-restart")
//           .setLabel("Restart")
//           .setStyle(ButtonStyle.Primary)
//           .setEmoji("<:power:1259859763240501268>")
//           .setDisabled(false),
//         new ButtonBuilder()
//           .setCustomId("customer-stop")
//           .setLabel("Stop")
//           .setStyle(ButtonStyle.Danger)
//           .setEmoji("<:bomb:1259859765241188352>")
//           .setDisabled(false),
//         new ButtonBuilder()
//           .setCustomId("customer-setname")
//           .setLabel("Set Name")
//           .setStyle(ButtonStyle.Secondary)
//           .setEmoji("<:renamesolid24:1259433901554929675>")
//           .setDisabled(false),
//         new ButtonBuilder()
//           .setCustomId("customer-delete")
//           .setLabel("Delete")
//           .setStyle(ButtonStyle.Danger)
//           .setEmoji("<:trash:1259432932234367069>")
//           .setDisabled(false)
//       );
//
//       const settings = new ActionRowBuilder<ButtonBuilder>().addComponents(
//         new ButtonBuilder()
//           .setCustomId("customer-edit")
//           .setLabel("Edit the Customer")
//           .setStyle(ButtonStyle.Secondary)
//           .setEmoji("<:edit:1259961121075626066>")
//           .setDisabled(false),
//         new ButtonBuilder()
//           .setCustomId("customer-back")
//           .setLabel("Go back")
//           .setStyle(ButtonStyle.Secondary)
//           .setEmoji("<:arrow:1259960970177151097>"),
//         new ButtonBuilder()
//           .setCustomId("customer-refresh")
//           .setLabel("Refresh")
//           .setStyle(ButtonStyle.Secondary)
//           .setEmoji("<:refresh:1260140823106813953>")
//           .setDisabled(false),
//         new ButtonBuilder()
//           .setStyle(ButtonStyle.Link)
//           .setLabel("Invite")
//           .setURL(
//             `https://discord.com/oauth2/authorize?client_id=${customer?.Application}&permissions=8&scope=bot+applications.commands`
//           )
//           .setEmoji("<:discordaltlogo:1259962258436390942>")
//       );
//
//       await interaction.update({
//         embeds: [embed],
//         components: [row, settings],
//       });
//     });
//   },
// };
