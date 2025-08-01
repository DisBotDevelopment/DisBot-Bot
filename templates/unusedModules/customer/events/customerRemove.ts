// import {Events, Guild} from "discord.js";
// import {customerDB} from "../../../schema/customerDB.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   name: Events.GuildDelete,
//
//   /**
//    * @param {Guild} guild
//    * @param {ExtendedClient} client
//    */
//   async execute(guild: Guild, client: ExtendedClient) {
//
//     const data = await customerDB.findOne({ Application: client.user?.id });
//     if (!data) return;
//     await customerDB.findOneAndUpdate(
//       { Application: client.user?.id },
//       { $pull: { Guilds: guild.id } }
//     );
//   },
// };
