// import {
//     ActionRowBuilder,
//     ButtonBuilder,
//     ButtonInteraction,
//     ButtonStyle,
//     EmbedBuilder,
//     MessageFlags,
//     TextInputStyle
// } from "discord.js";
// import {ExtendedClient} from "../../../types/client.js";
// import {convertToEmojiPng} from "../../../helper/emojis.js";
//
// export default {
//   id: "create-customer-guide",
//
//   /**
//    *
//    * @param {ButtonInteraction} interaction
//    * @param {ExtendedClient} client
//    */
//   async execute(interaction: ButtonInteraction, client: ExtendedClient) {
//
//     if (!client.user) throw new Error("Client user is not cached.");
//     const embed = new EmbedBuilder()
//       .setColor("#2B2D31")
//       .setDescription([
//         `## ${await convertToEmojiPng("info", client.user.id)} **Create your Customer**`,
//         `**1.** Click the button below to create your Customer bot.`,
//         `**2.** Paste your bot token and application ID in the modal that appears.`,
//         `-# - Please select all Gateways and Privileged Intents in the Developer Portal.`,
//         `**3.** Wait for the bot to be created and your see a invite url.`,
//         `**4.** Enjoy your new Customer bot!`,
//         ``,
//         `## ${await convertToEmojiPng("check", client.user.id)} **Note:**`,
//         `- Make sure you have the necessary permissions to create a bot.`,
//         `- If you encounter any issues, please contact support.`,
//       ].join("\n"))
//
//     const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
//       new ButtonBuilder()
//         .setCustomId("create-customer")
//         .setLabel("Create Customer")
//         .setEmoji("<:disbotnew:1376636202631041046>")
//         .setStyle(ButtonStyle.Secondary),
//     )
//
//     interaction.reply({
//       embeds: [embed],
//       components: [row],
//       flags: MessageFlags.Ephemeral
//     });
//
//   },
// };
