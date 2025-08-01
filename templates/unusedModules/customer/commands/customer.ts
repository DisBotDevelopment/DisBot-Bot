// import {
//     ActionRowBuilder,
//     ButtonBuilder,
//     ButtonStyle,
//     ChatInputCommandInteraction,
//     ComponentType,
//     EmbedBuilder,
//     MessageFlags,
//     PermissionFlagsBits,
//     SlashCommandBuilder,
//     StringSelectMenuBuilder
// } from "discord.js";
// import { convertToEmojiPng } from "../../../helper/emojis.js";
// import { customerDB } from "../../../schema/customerDB.js";
// import { userDB } from "../../../schema/userDB.js";
// import { ExtendedClient } from "../../../types/client.js";
//
// export default {
//     help: {
//         name: "Customer",
//         description: "Create and manage your own DisBot Customer (Custom-Branding) and more at https://disbot.app/ultra - SOON™",
//         usage: "/customer",
//         examples: [],
//         aliases: [],
//         docsLink: "https://discord.com/channels/1084507523492626522/1163770373544878130/1375212475296780462",
//     },
//     data: new SlashCommandBuilder()
//         .setName("customer")
//         .setDMPermission(true)
//         .setDescription("Manage Your DisBot Customer")
//         .setDescriptionLocalizations({
//             de: "Verwalten Sie Ihren DisBot-Customer"
//         })
//         .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
//
//     /**
//      *
//      * @param {ChatInputCommandInteraction} interaction
//      * @param {ExtendedClient} client
//      *
//      */
//
//     async execute(
//         interaction: ChatInputCommandInteraction,
//         client: ExtendedClient
//     ) {
//         await interaction.deferReply({
//             flags: MessageFlags.Ephemeral
//         });
//
//         if (!client.user) throw new Error("Client user is not cached.");
//         return interaction.editReply({
//             content: `## ${await convertToEmojiPng(
//                 "disbotultra",
//                 client.user.id
//             )} DisBot Ultra is currently in development and will be released soon. Please check back later for updates.`,
//             components: [
//                 new ActionRowBuilder<ButtonBuilder>().addComponents(
//                     new ButtonBuilder()
//                         .setLabel("DisBot Ultra")
//                         .setEmoji("<:disbotultra:1260157236043583519>")
//                         .setStyle(ButtonStyle.Link)
//                         .setURL("https://disbot.app/ultra")
//                 )
//             ]
//         });
//
//         // if (!client.user) throw new Error("Client user is not cached.");
//
//         // const data = await userDB.findOne({ UserID: interaction.user.id });
//
//         // if (!data) {
//         //     await userDB.create({
//         //         UserID: interaction.user.id,
//         //         Votes: 0,
//         //         GloablVotes: 0,
//         //         CustomerBots: 1
//         //     });
//         //     return interaction.editReply({
//         //         content: `## ${await convertToEmojiPng(
//         //             "info",
//         //             client.user.id
//         //         )} Your profile has been created. Please run the command again.`
//         //     });
//         // }
//
//         // const customer = await customerDB.findOne({
//         //     UserID: interaction.user.id,
//         //     Application: client.user.id
//         // });
//         // if (customer) {
//         //     // Bot-Statistiken erstellen
//         //     const botUptime = ((client.uptime as number) / 1000).toFixed(2); // Uptime in Sekunden
//         //     const botGuildsCount = client.guilds.cache.size; // Anzahl der Server, auf denen der Bot ist
//         //     const botUsersCount = client.users.cache.size; // Anzahl der Benutzer, die der Bot sehen kann
//
//         //     // Embed mit Bot-Statistiken
//         //     const embed = new EmbedBuilder()
//         //         .setThumbnail(client.user.displayAvatarURL())
//         //         .setDescription(
//         //             [
//         //                 `## ${await convertToEmojiPng(
//         //                     "disbot",
//         //                     client.user.id
//         //                 )} Control Panel`,
//         //                 ``,
//         //                 `> ${await convertToEmojiPng("bot", client.user.id)} **Bot:** ${client.user
//         //                 } (\`${client.user.tag}\`)`,
//         //                 `> ${await convertToEmojiPng(
//         //                     "timer",
//         //                     client.user.id
//         //                 )} **Uptime:** \`${botUptime} seconds\``,
//         //                 `> ${await convertToEmojiPng(
//         //                     "disbot",
//         //                     client.user.id
//         //                 )} **Servers:** \`${botGuildsCount}\``,
//         //                 `> ${await convertToEmojiPng(
//         //                     "user",
//         //                     client.user.id
//         //                 )} **Users:** \`${botUsersCount}\``,
//         //                 `> ${await convertToEmojiPng(
//         //                     "id",
//         //                     client.user.id
//         //                 )} **Application ID:** \`${interaction.user.id}\``,
//         //                 ``
//         //             ].join("\n")
//         //         );
//
//         //     // Buttons erstellen
//         //     const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
//         //         new ButtonBuilder()
//         //             .setCustomId("customer-bot-set-status")
//         //             .setLabel("Set Status")
//         //             .setEmoji("<:status:1260148500247609416>")
//         //             .setStyle(ButtonStyle.Secondary),
//         //         new ButtonBuilder()
//         //             .setCustomId("customer-bot-set-avatar")
//         //             .setLabel("Set Avatar")
//         //             .setEmoji("<:imageadd:1260148502449754112>")
//         //             .setStyle(ButtonStyle.Secondary),
//         //         new ButtonBuilder()
//         //             .setCustomId("customer-bot-set-banner")
//         //             .setLabel("Set Banner")
//         //             .setEmoji("<:imageadd:1260148502449754112>")
//         //             .setStyle(ButtonStyle.Secondary),
//         //         new ButtonBuilder()
//         //             .setCustomId("customer-management")
//         //             .setLabel("Customer Management")
//         //             .setEmoji("<:setting:1260156922569687071>")
//         //             .setStyle(ButtonStyle.Secondary)
//         //     );
//
//         //     // Antwort mit Embed und Buttons senden
//         //     return interaction.editReply({
//         //         embeds: [embed],
//         //         components: [buttons]
//         //     });
//         // } else {
//         //     const embed = new EmbedBuilder()
//         //         .setDescription(
//         //             [
//         //                 `## ${await convertToEmojiPng(
//         //                     "disbot",
//         //                     client.user.id
//         //                 )} DisBot Customer`,
//         //                 ``,
//         //                 `> **Welcome to DisBot Customer. You can create and manage your own Customer Bot.`,
//         //                 `> To create a new Customer Bot, click the button below.**`,
//         //                 `Note: The Customer is known as a Custom-Branding.`,
//         //                 ``,
//         //                 `### Informationen:`,
//         //                 ``,
//         //                 `> <:bot:1259853378041942088> - **Customers**: \`${await customerDB.countDocuments(
//         //                     {
//         //                         UserID: interaction.user.id
//         //                     }
//         //                 )}/${(data?.CustomerBots as number) + 1}\``,
//         //                 `> ${await convertToEmojiPng(
//         //                     "box",
//         //                     client.user.id
//         //                 )} - **Votes**: \`${data.Votes}\``,
//         //                 `> ${await convertToEmojiPng(
//         //                     "globe",
//         //                     client.user.id
//         //                 )} - **Global Votes**: \`${data.GloablVotes}\``,
//         //                 `> ${await convertToEmojiPng(
//         //                     "upvote",
//         //                     client.user.id
//         //                 )} - **Votes needed to a Bot**: \`${data.Votes}/10\``,
//         //                 `> ${await convertToEmojiPng(
//         //                     "support",
//         //                     client.user.id
//         //                 )} - **Support**: [Support Server](https://discord.gg/VYYQxGS6Eg)`
//         //             ].join("\n")
//         //         )
//         //         .setColor("#2B2D31")
//         //         .setFooter({
//         //             text: "DisBot Customer",
//         //             iconURL: client.user.displayAvatarURL()
//         //         });
//
//         //     const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
//         //         new ButtonBuilder()
//         //             .setLabel("Create new Customer Bot")
//         //             .setEmoji("<:add:1260157236043583519>")
//         //             .setCustomId("create-customer-guide")
//         //             .setStyle(ButtonStyle.Primary)
//         //         // new ButtonBuilder()
//         //         // .setStyle(ButtonStyle.Link)
//         //         // .setLabel("Invite")
//         //         // .setURL(
//         //         //   `https://discord.com/oauth2/authorize?client_id=345&permissions=8&scope=bot+applications.commands`
//         //         // )
//         //     );
//
//         //     const customers = await customerDB.find({ UserID: interaction.user.id });
//
//         //     if (customers.length <= 0) {
//         //         interaction.editReply({
//         //             embeds: [embed],
//         //             components: [row]
//         //         });
//         //         return;
//         //     }
//
//         //     const customerOptions: any[] = [];
//
//         //     (
//         //         await customerDB
//         //             .find({ UserID: interaction.user.id })
//         //             .sort("-id UserID")
//         //     ).forEach((customerdata: any) => {
//         //         customerOptions.push({
//         //             label: customerdata.DisplayName
//         //                 ? customerdata.DisplayName
//         //                 : customerdata.DisplayName,
//         //             value: customerdata.ExternalUUID,
//         //             description: `UUID: ${customerdata.ExternalUUID} - Application: ${customerdata.Application}`,
//         //             emoji: "<:bot:1259853378041942088>"
//         //         });
//         //     });
//
//         //     const customerList =
//         //         new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
//         //             new StringSelectMenuBuilder()
//         //                 .setCustomId("customer-select")
//         //                 .setPlaceholder("🎨 Manage a Customer")
//         //                 .addOptions(customerOptions) // Fügen Sie alle gesammelten Optionen hinzu
//         //                 .setMinValues(1)
//         //                 .setMaxValues(1)
//         //         );
//
//         //     if (customerOptions.length >= 25) {
//         //         if (embed.data.author) {
//         //             embed.data.author.name =
//         //                 "You have reached the maximum number of Customer Bots.";
//         //         }
//
//         //         interaction.editReply({
//         //             embeds: [embed],
//         //             components: [customerList]
//         //         });
//         //     }
//
//         //     interaction.editReply({
//         //         embeds: [embed],
//         //         components: [row, customerList]
//         //     });
//         // }
//     }
// };
