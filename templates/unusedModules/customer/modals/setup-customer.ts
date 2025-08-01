// import axios from "axios";
// import {ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, ModalSubmitInteraction,} from "discord.js";
// import pkg from "short-uuid";
// const { uuid } = pkg;
// import {customerDB} from "../../../schema/customerDB.js";
// import {userDB} from "../../../schema/userDB.js";
// import {ExtendedClient} from "../../../types/client.js";
// import {convertToEmojiGif, convertToEmojiPng} from "../../../helper/emojis.js";
//
// export default {
//   id: "setup-customer",
//
//   /**
//    *
//    * @param {ModalSubmitInteraction} interaction
//    * @param {Client} client
//    */
//   async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
//     const uuids = uuid();
//     await interaction.deferReply({ flags: MessageFlags.Ephemeral });
//
//     if (!client.user) throw new Error("Cluster user is not defined.");
//     interaction.editReply({
//       content: `## ${await convertToEmojiGif("loading", client.user?.id)} Preparing services and setup...`,
//     });
//
//     const token = interaction.fields.getTextInputValue("token");
//     const botid = interaction.fields.getTextInputValue("botid");
//
//     const botcount = await userDB.findOne({ UserID: interaction.user.id });
//     const currentCustomers = await customerDB.find({
//       UserID: interaction.user.id,
//     });
//
//     if (!client.user) throw new Error("Client user is not defined.");
//     if (botcount?.CustomerBots == currentCustomers.length)
//       return interaction.editReply({
//         content: `## ${await convertToEmojiPng("error", client.user?.id)} You have reached the maximum number of customer bots you can create. Please delete one before creating a new one.`,
//       });
//
//     const apiURl = process.env.PELICAN_APPLICATION_API;
//     const apiKey = process.env.PELICAN_API;
//
//     const allUsers = await axios.get(`${apiURl}/users`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//     });
//
//     let userExists = false;
//     allUsers.data.data.forEach(async (user: any) => {
//       if (user.attributes.username == interaction.user.id) {
//         userExists = true;
//         return;
//       } else {
//         userExists = false;
//         return;
//       }
//     });
//
//     interaction.editReply({
//       content: `## ${await convertToEmojiGif("loading", client.user?.id)} Loading your user data...`,
//     });
//
//     if (!userExists) {
//       const createUser = await axios.post(
//         `${apiURl}/users`,
//         {
//           external_id: interaction.user.id,
//           username: interaction.user.id,
//           email: interaction.user.id + "@customer.disbot.com",
//           timezone: "Europe/Berlin",
//           language: "af",
//           password: interaction.user.id,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${apiKey}`,
//           },
//         }
//       );
//
//       if (createUser.status !== 201) {
//         return interaction.editReply({
//           content: `## ${await convertToEmojiPng("error", client.user?.id)} An error occurred while creating your user. Please try again later.`,
//         });
//       }
//     }
//
//     const user = await axios.get(
//       `${apiURl}/users/external/${interaction.user.id}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${apiKey}`,
//         },
//       }
//     );
//
//     // Use node 1 for now
//     const freeAllocation = await axios.get(`${apiURl}/nodes/1/allocations`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//     });
//     const freeAllocations = freeAllocation.data.data.filter(
//       (allocation: any) => allocation.attributes.assigned == false
//     );
//
//     interaction.editReply({
//       content: `## ${await convertToEmojiGif("loading", client.user?.id)} Creating your server...`,
//     });
//
//     const apiPortForCustomer = freeAllocations[0].attributes.port.toString();
//     const wsPortForCustomer = freeAllocations[1].attributes.port.toString();
//
//     const createServer = await axios.post(
//       `${apiURl}/servers`,
//       {
//         external_id: uuids,
//         name: uuids,
//         description: `Customer Bot - Created by ${interaction.user.id}`,
//         user: user.data.attributes.id,
//         egg: 15,
//         docker_image: "ghcr.io/jesforge/disbotcustomer:latest",
//         environment: {
//           MONGODBURL: process.env.MONGODBURL,
//           TOKEN: token,
//           APPLICATIONID: botid,
//           PELICAN_API: apiKey,
//           APIPORT: apiPortForCustomer,
//           WS_PORT: wsPortForCustomer,
//           PELICAN_CLIENT_API_TOKEN: process.env.PELICAN_CLIENT_API_TOKEN,
//           PELICAN_CLIENT_API: process.env.PELICAN_CLIENT_API,
//           PELICAN_APPLICATION_API: process.env.PELICAN_APPLICATION_API,
//           TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET,
//           TIKTOK_CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY,
//           SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
//           SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
//           EVENTS_API_KEY: process.env.EVENTS_API_KEY,
//           DBNAME: process.env.DBNAME,
//           ERROR_WEBHOOK: process.env.ERROR_WEBHOOK,
//           BOT_TYPE: "CUSTOMER",
//           SENTRY_DSN: process.env.SENTRY_DSN,
//           SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
//         },
//         limits: {
//           memory: 512,
//           swap: -1,
//           disk: 0,
//           io: 500,
//           cpu: 200,
//         },
//         feature_limits: {
//           databases: 0,
//           allocations: 2,
//           backups: 0,
//         },
//         allocation: {
//           default: freeAllocations[0].attributes.id.toString(),
//           additional: [freeAllocations[1].attributes.id.toString()],
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${apiKey}`,
//         },
//       }
//     );
//
//     if (createServer.status !== 201) {
//       return interaction.editReply({
//         content: `## ${await convertToEmojiPng("error", client.user?.id)} An error occurred while creating your server. Please try again later.`,
//       });
//     }
//
//     interaction.editReply({
//       content: `## ${await convertToEmojiPng("info", client.user?.id)} Customer Bot is being created! Please wait a moment...`,
//     });
//
//     setTimeout(async () => {
//       const server = await axios.get(`${apiURl}/servers/external/${uuids}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.PELICAN_CLIENT_API_TOKEN}`,
//         },
//       });
//
//       const serverUUID = server.data.attributes.uuid;
//
//       const clientServer = await axios.get(
//         `${process.env.PELICAN_CLIENT_API}/servers/${serverUUID}/network/allocations`,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.PELICAN_CLIENT_API_TOKEN}`,
//           },
//         }
//       );
//
//       const clientServerData = clientServer.data.data;
//
//       await customerDB.create({
//         UserID: interaction.user.id,
//         ExternalUUID: server.data.attributes.external_id,
//         RealUUID: server.data.attributes.uuid,
//         Application: botid,
//         DisplayName: `Customer Bot - ${botid}`,
//         GuildID: [],
//         ServerPort: clientServerData[0].attributes.port,
//         WSAPI: clientServerData[1].attributes.port,
//       });
//
//       await axios.post(
//         `${process.env.PELICAN_CLIENT_API}/servers/${serverUUID}/power`,
//         {
//           signal: "start",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.PELICAN_CLIENT_API_TOKEN}`,
//           },
//         }
//       );
//
//       if (!client.user) throw new Error("Client user is not defined.");
//       interaction.editReply({
//         content: `## ${await convertToEmojiPng("check", client.user?.id)} Customer created successfully!`,
//         components: [
//           new ActionRowBuilder<ButtonBuilder>().addComponents(
//             new ButtonBuilder()
//               .setLabel("Invite Bot")
//               .setURL(
//                 `https://discord.com/oauth2/authorize?client_id=${botid}&permissions=8&scope=bot+applications.commands`
//               )
//               .setEmoji("<:add:1260157236043583519>")
//               .setStyle(ButtonStyle.Link)
//           ),
//         ],
//       });
//     }, 10000);
//   },
// };
