// import {
//     ActionRowBuilder,
//     ButtonBuilder,
//     ButtonInteraction,
//     ButtonStyle,
//     EmbedBuilder,
//     MessageFlags,
//     StringSelectMenuBuilder,
//     StringSelectMenuOptionBuilder
// } from "discord.js";
// import {customerDB} from "../../../schema/customerDB.js";
// import {userDB} from "../../../schema/userDB.js";
// import {ExtendedClient} from "../../../types/client.js";
// import {convertToEmojiPng} from "../../../helper/emojis.js";
//
// export default {
//   id: "customer-back",
//
//   /**
//    *
//    * @param {ButtonInteraction} interaction
//    * @param {ExtendedClient} client
//    */
//
//   async execute(interaction: ButtonInteraction, client: ExtendedClient) {
//     if (!client.user) throw new Error("Client not ready");
//
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
//           `> ${await convertToEmojiPng(
//             "bot",
//             client.user.id
//           )} - **Customers**: \`${await customerDB.countDocuments({
//             UserID: interaction.user.id
//           })}/${(data?.CustomerBots as number) + 1}\``,
//           `> ${await convertToEmojiPng("box", client.user.id)} - **Votes**: \`${data?.Votes
//           }\``,
//           `> ${await convertToEmojiPng(
//             "globe",
//             client.user.id
//           )} - **Global Votes**: \`${data?.GloablVotes}\``,
//           `> ${await convertToEmojiPng(
//             "upvote",
//             client.user.id
//           )} - **Votes needed to a Bot**: \`${data?.Votes}/10\``,
//           `> ${await convertToEmojiPng(
//             "support",
//             client.user.id
//           )} - **Support**: [Support Server](https://discord.gg/VYYQxGS6Eg)`
//         ].join("\n")
//       )
//       .setColor("#2B2D31")
//       .setFooter({
//         text: "DisBot Customer",
//         iconURL: client.user.displayAvatarURL()
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
//       return interaction.update({
//         embeds: [embed],
//         components: [row]
//       });
//     }
//
//     // Create options for all customers
//     const customerOptions = customers.map(
//       (customerdata) =>
//         new StringSelectMenuOptionBuilder()
//           .setLabel(customerdata?.DisplayName || "No Name")
//           .setValue(customerdata.ExternalUUID || "")
//           .setDescription(
//             `UUID: ${customerdata.ExternalUUID} - Application: ${customerdata.Application}`
//           )
//           .setEmoji({ id: "1259853378041942088", name: "bot" }) // Correct custom emoji structure
//     );
//
//     const customerList =
//       new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
//         new StringSelectMenuBuilder()
//           .setCustomId("customer-select")
//           .setPlaceholder("🎨 Manage a Customer")
//           .addOptions(customerOptions) // Add all options here
//           .setMinValues(1)
//           .setMaxValues(1)
//       );
//
//     interaction.update({
//       embeds: [embed],
//       components: [row, customerList]
//     });
//   }
// };
