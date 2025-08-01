// import {ActivityType, Client, ModalSubmitInteraction, PresenceStatusData, PresenceUpdateStatus} from "discord.js";
// import {customerDB} from "../../../schema/customerDB.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   id: "customer-bot-set-status-submit",
//
//   /**
//    *
//    * @param {ModalSubmitInteraction} interaction
//    * @param {Client} client
//    */
//
//   async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
//     const text = interaction.fields.getTextInputValue("text");
//     const type = interaction.fields.getTextInputValue("type");
//     const status = interaction.fields.getTextInputValue("status");
//     const url = interaction.fields.getTextInputValue("url") as string;
//
//     let types;
//     let states;
//
//     if (type === "Playing") types = ActivityType.Playing;
//     else if (type === "Listening") types = ActivityType.Listening;
//     else if (type === "Watching") types = ActivityType.Watching;
//     else if (type === "Streaming") types = ActivityType.Streaming;
//     else if (type === "Custom") types = ActivityType.Custom;
//
//     if (status === "Online") states = PresenceUpdateStatus.Online;
//     else if (status === "Idle") states = PresenceUpdateStatus.Idle;
//     else if (status === "DoNotDisturb")
//       states = PresenceUpdateStatus.DoNotDisturb;
//     else if (status === "Offline") states = PresenceUpdateStatus.Offline;
//
//     if (!client.user) throw new Error("Client user is not available.");
//
//     client.user.presence.set({
//       status: states as PresenceStatusData,
//       activities: [
//         {
//           type: types,
//           name: text,
//           url: url ? url : undefined
//         }
//       ]
//     });
//
//     await customerDB.findOneAndUpdate(
//       { Application: client.user.id, UserID: interaction.user.id },
//       {
//         BotStatus: {
//           Type: types,
//           Text: text,
//           Status: states,
//           URL: url ?? ""
//         }
//       }
//     );
//
//     interaction.deferUpdate();
//   }
// };
