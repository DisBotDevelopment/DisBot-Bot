// import {
//     ActionRowBuilder,
//     ButtonInteraction,
//     ButtonStyle,
//     ModalBuilder,
//     TextInputBuilder,
//     TextInputStyle
// } from "discord.js";
// import {ExtendedClient} from "../../../types/client.js";
//
// export default {
//   id: "create-customer",
//
//     /**
//      *
//      * @param {ButtonInteraction} interaction
//      * @param {ExtendedClient} client
//      */
//     async execute(interaction: ButtonInteraction, client: ExtendedClient) {
//
//
//         const modal = new ModalBuilder();
//
//         const token = new TextInputBuilder();
//         const botid = new TextInputBuilder();
//         const memberid = new TextInputBuilder();
//
//         modal.setTitle("Make your Customer").setCustomId("setup-customer");
//
//         token
//             .setCustomId("token")
//             .setPlaceholder("Pate your bot token here to create your Customer bot")
//             .setLabel("Discord Bot Token")
//             .setRequired(true)
//             .setStyle(TextInputStyle.Short);
//
//         botid
//             .setCustomId("botid")
//             .setPlaceholder("Pate your bot ID here to create your Customer bot")
//             .setLabel("Discord Application ID")
//             .setRequired(true)
//             .setStyle(TextInputStyle.Short);
//
//         memberid
//             .setCustomId("memberid")
//             .setValue(interaction.user.id)
//             .setPlaceholder("[NOT CHANGE THIS]")
//             .setLabel("Member ID")
//             .setRequired(true)
//             .setMinLength(10)
//             .setStyle(TextInputStyle.Short);
//
//         modal.addComponents(
//             new ActionRowBuilder<TextInputBuilder>().addComponents(token),
//             new ActionRowBuilder<TextInputBuilder>().addComponents(botid),
//             new ActionRowBuilder<TextInputBuilder>().addComponents(memberid)
//         );
//
//         interaction.showModal(modal);
//
//
//
//     },
// };
