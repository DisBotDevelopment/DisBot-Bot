// import {
//     ActionRowBuilder,
//     ButtonBuilder,
//     ButtonInteraction,
//     ButtonStyle,
//     EmbedBuilder,
//     StringSelectMenuBuilder,
//     TextInputStyle
// } from "discord.js";
// import {customerDB} from "../../../schema/customerDB.js";
// import {userDB} from "../../../schema/userDB.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   id: "customer-management",
//
//   /**
//    *
//    * @param {ButtonInteraction} interaction
//    * @param {ExtendedClient} client
//    */
//   async execute(interaction: ButtonInteraction, client: ExtendedClient) {
//     const data = await userDB.findOne({ UserID: interaction.user.id });
//
//     const embed = new EmbedBuilder()
//       .setTitle("DisBot Customer")
//       .setDescription(
//         [
//           `> Welcome to DisBot Customer. Here you can create and manage your own Customer Bot.`,
//           `> To create a new Customer Bot, click the button below.`,
//           ``,
//           `### Informationen:`,
//           ``,
//           `> <:bot:1259853378041942088> - **Customers**: \`${await customerDB.countDocuments(
//             {
//               UserID: interaction.user.id
//             }
//           )}/${(data?.CustomerBots as number) + 1}\``,
//           `> <:box:1259853376368148601> - **Votes**: \`${data?.Votes}\``,
//           `> <:globe:1259432929453674506> - **Global Votes**: \`${data?.GloablVotes}\``,
//           `> <:upvote:1259853379363016744> - **Votes needed to a Bot**: \`${data?.Votes}/10\``,
//           `> <:support:1259853380885549117> - **Support**: [Support Server](https://discord.gg/VYYQxGS6Eg)`
//         ].join("\n")
//       )
//       .setColor("#2B2D31")
//       .setFooter({
//         text: "DisBot Customer",
//         iconURL: client.user?.displayAvatarURL()
//       });
//
//     const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
//       new ButtonBuilder()
//         .setLabel("Create new Customer Bot")
//         .setEmoji("<:add:1260157236043583519>")
//         .setCustomId("install-disbot-customer")
//         .setStyle(ButtonStyle.Primary)
//     );
//
//     const customers = await customerDB.find({ UserID: interaction.user.id });
//
//     if (customers.length <= 0) {
//       interaction.update({
//         embeds: [embed],
//         components: [row]
//       });
//       return;
//     }
//
//     const customerOptions: any[] = [];
//
//     (
//       await customerDB.find({ UserID: interaction.user.id }).sort("-id UserID")
//     ).forEach((customerdata) => {
//       customerOptions.push({
//         label: customerdata.DisplayName
//           ? customerdata.DisplayName
//           : customerdata.DisplayName,
//         value: customerdata.ExternalUUID,
//         description: `UUID: ${customerdata.ExternalUUID} - Application: ${customerdata.Application}`,
//         emoji: "<:bot:1259853378041942088>"
//       });
//     });
//
//     const customerList =
//       new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
//         new StringSelectMenuBuilder()
//           .setCustomId("customer-select")
//           .setPlaceholder("🎨 Manage a Customer")
//           .addOptions(customerOptions) // Fügen Sie alle gesammelten Optionen hinzu
//           .setMinValues(1)
//           .setMaxValues(1)
//       );
//
//     if (customerOptions.length >= 25) {
//       embed.setAuthor({
//         name: "You have reached the maximum number of Customer Bots.",
//         iconURL: embed.data.author?.icon_url
//       });
//
//       interaction.update({
//         embeds: [embed],
//         components: [customerList]
//       });
//     }
//
//     interaction.update({
//       embeds: [embed],
//       components: [row, customerList]
//     });
//   }
// };
