import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    PermissionsBitField,
    TextChannel,
} from "discord.js";
import shortUUID from "short-uuid";
import {manageMessages, readMessageHistory, sendMessages, viewChannel,} from "../../../api/disbot-api.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";

export default {
    id: "ticket-menu-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        /*   const {guild, member} = interaction;
          
           const message = await interaction.channel?.messages.fetch(
               interaction.message?.id as string
           );
   
           let ticketmenusData = await database.ticketSetups.findFirst({
               where: {
                   CustomId: interaction.components[0].components[0].customId,
               }
           });
   
           let option1 = ticketmenusData?.ModalOptions1?.Name
               ? interaction?.fields?.getTextInputValue(
                   interaction?.components[0]?.components[0].customId
               )
               : null;
   
           let option2 = ticketmenusData?.ModalOptions2?.Name
               ? interaction?.fields?.getTextInputValue(
                   interaction?.components[1]?.components[0].customId
               )
               : null;
   
           let option3 = ticketmenusData?.ModalOptions3?.Name
               ? interaction?.fields?.getTextInputValue(
                   interaction?.components[2]?.components[0].customId
               )
               : null;
   
           let option4 = ticketmenusData?.ModalOptions4?.Name
               ? interaction?.fields?.getTextInputValue(
                   interaction?.components[3]?.components[0].customId
               )
               : null;
   
           let option5 = ticketmenusData?.ModalOptions5?.Name
               ? interaction?.fields?.getTextInputValue(
                   interaction?.components[4]?.components[0].customId
               )
               : null;
   
           const fortickets = await database.ticketSetups
               .findMany({
                   where: {
                       CustomId: interaction.components[0].components[0].customId,
                   }
               })
           for (const ticketSetupDocument of fortickets) {
               if (!ticketSetupDocument.CustomId) continue;
               if (!client.user) throw new Error("Client is not defined");
               if (!ticketSetupDocument)
                   interaction.reply({
                       content: `## ${await convertToEmojiPng(
                           "error",
                           client.user.id
                       )} Please setup the ticket menu first!`,
                   });
   
               const blacklisted = interaction.guild?.members.cache.get(
                   interaction.user.id
               );
   
               if (
                   blacklisted?.roles.cache.has(
                       ticketSetupDocument.TicketBlackListRoles[0] as string
                   )
               ) {
                   await interaction.reply({
                       content: `## ${await convertToEmojiPng(
                           "error",
                           client.user.id
                       )} You are blacklisted from creating tickets in this Panel.`,
                       flags: MessageFlags.Ephemeral,
                   });
   
                   continue;
               }
               const rowbutton = new ActionRowBuilder<ButtonBuilder>().addComponents([
                   new ButtonBuilder()
                       .setCustomId("button-ticket-close")
                       .setEmoji("<:trash:1259432932234367069>")
                       .setLabel("Close Ticket")
                       .setStyle(ButtonStyle.Danger),
                   new ButtonBuilder()
                       .setCustomId("button-ticket-claim")
                       .setEmoji("<:support:1259853380885549117>")
                       .setLabel("Ticket Claim")
                       .setStyle(ButtonStyle.Success),
                   new ButtonBuilder()
                       .setCustomId("button-ticket-look")
                       .setLabel("Ticket Lock")
                       .setEmoji("<:lock:1288527034519388222>")
                       .setStyle(ButtonStyle.Secondary),
                   new ButtonBuilder()
                       .setCustomId("button-ticket-transscript")
                       .setLabel("Ticket Transccript")
                       .setEmoji("<:description:1321938426576109768>")
                       .setStyle(ButtonStyle.Secondary),
               ]);
   
               const rowbutton2 = new ActionRowBuilder<ButtonBuilder>().addComponents([
                   new ButtonBuilder()
                       .setCustomId("ticket-buttom-member-add")
                       .setLabel("Add User to Ticket")
                       .setEmoji("<:useradd:1288520279622025286>")
                       .setStyle(ButtonStyle.Secondary),
                   new ButtonBuilder()
                       .setCustomId("ticket-buttom-member-remove")
                       .setLabel("Remove User from Ticket")
                       .setEmoji("<:userremove:1288520285666152448>")
                       .setStyle(ButtonStyle.Danger),
               ]);
   
               let messageData = await database.messageTemplates.findFirst({
                   where: {
                       Name: ticketmenusData?.MessageTempleateId,
                   }
               });
   
               let embeddata = messageData?.Content
                   ? messageData?.Content?.replace(
                       "{modal.option.1}",
                       option1 ? option1 : "No Data"
                   )
                       .replace("{modal.option.2}", option2 ? option2 : "No Data")
                       .replace("{modal.option.3}", option3 ? option3 : "No Data")
                       .replace("{modal.option.4}", option4 ? option4 : "No Data")
                       .replace("{modal.option.5}", option5 ? option5 : "No Data")
                       .replace("{guild.name}", interaction.guild?.name as string)
                       .replace("{guild.id}", interaction.guild?.id as string)
                       .replace("{member.name}", interaction.user.username)
                       .replace(
                           "{member.globalname}",
                           interaction.user.globalName as string
                       )
                       .replace("{member.displayname}", interaction.user.displayName)
                       .replace("{member.id}", interaction.user.id)
                       .replace("{member.tag}", `<@${interaction.user.id}>`)
                       .replace("{handlers.id}", ticketmenusData.Handlers[0] as string)
                       .replace("{handlers.tag}", `<@&${ticketmenusData.Handlers}>`)
                       .replace("{current.date}", Date)
                       .replace(
                           "https://i.imgur.com/kjEQRRI.png",
                           interaction.user.displayAvatarURL({extension: "png"})
                       )
                   : messageData?.EmbedJSON
                       ? messageData?.EmbedJSON?.replace(
                           "{modal.option.1}",
                           option1 ? option1 : "No Data"
                       )
                           .replace("{modal.option.2}", option2 ? option2 : "No Data")
                           .replace("{modal.option.3}", option3 ? option3 : "No Data")
                           .replace("{modal.option.4}", option4 ? option4 : "No Data")
                           .replace("{modal.option.5}", option5 ? option5 : "No Data")
                           .replace("{guild.name}", interaction.guild?.name as string)
                           .replace("{guild.id}", interaction.guild?.id as string)
                           .replace("{member.name}", interaction.user.username)
                           .replace(
                               "{member.globalname}",
                               interaction.user.globalName as string
                           )
                           .replace("{member.displayname}", interaction.user.displayName)
                           .replace("{member.id}", interaction.user.id)
                           .replace("{member.tag}", `<@${interaction.user.id}>`)
                           .replace("{handlers.id}", ticketmenusData?.Handlers[0] as string)
                           .replace("{handlers.tag}", `<@&${ticketmenusData?.Handlers}>`)
                           .replace("{current.date}", Date())
                           .replace(
                               "https://i.imgur.com/kjEQRRI.png",
                               interaction.user.displayAvatarURL({extension: "png"})
                           )
                       : null;
   
               if (ticketmenusData?.IsThread == true) {
                   let channel;
                   const channelCategoryChecker = interaction.guild?.channels.cache.get(
                       ticketmenusData?.CategoryId as string
                   );
   
                   if (channelCategoryChecker?.type == ChannelType.GuildCategory) {
                       channel = interaction.guild?.channels.cache.get(
                           interaction.channel?.id as string
                       );
                   } else {
                       channel = interaction.guild?.channels.cache.get(
                           ticketmenusData?.CustomId as string
                       );
                   }
   
                   await (channel as TextChannel).threads
                       .create({
                           name: `${(ticketmenusData.TicketChannelName as string)
                               .replace("{guild.name}", interaction.guild?.name as string)
                               .replace("{guild.id}", interaction.guild?.id as string)
                               .replace("{member.name}", interaction.user.username)
                               .replace(
                                   "{member.globalname}",
                                   interaction.user.globalName as string
                               )
                               .replace("{member.displayname}", interaction.user.displayName)
                               .replace("{member.id}", interaction.user.id)
                               .replace(
                                   "{random.number}",
                                   Math.floor(Math.random() * 1000).toString()
                               )
                               .replace("{random.tag}", shortUUID.generate())
                               .replace(
                                   "{ticket.count}",
                                   (
                                       (await database.tickets.findMany({
                                           where: {SetupMessageId: interaction.message?.id}
                                       })).length + 1
                                   ).toString()
                               )}`,
                           type: ChannelType.PrivateThread,
                           reason: "Ticket System",
                       })
                       .then(async (thread) => {
                           interaction.reply({
                               embeds: [
                                   new EmbedBuilder()
                                       .setDescription(`## Ticket has Created <#${thread.id}>`)
                                       .setColor("#2B2D31"),
                               ],
                               flags: MessageFlags.Ephemeral,
                           });
                           await database.tickets.create({
                               data: {
                                   GuildId: interaction.guildId,
                                   ThreadId: thread.id,
                                   IsClaimed: false,
                                   UserWhoHasClaimedId: null,
                                   Looked: false,
                                   TicketOwner: interaction.user.id,
                                   Handlers: ticketmenusData.Handlers[0],
                                   TicketId: randomUUID(),
                                   SetupMessageId: ticketmenusData.MessageId,
                                   SetupChannelId: interaction.channelId,
                                   TranscriptChannelId: ticketmenusData.TranscriptChannelId,
                                   TicketSetupId: ticketmenusData.CustomId
                               }
                           });
   
                           await thread.members.add(interaction.user.id);
   
                           const message = thread.send({
                               content: `<@&${ticketmenusData.Handlers}>`,
                           });
                           await (await message).delete();
   
                           if (!embeddata) {
                               thread.send({
                                   content: messageData.Content
                                       ? messageData.Content.replace(
                                           "{modal.option.1}",
                                           option1 ? option1 : "No Data"
                                       )
                                           .replace(
                                               "{modal.option.2}",
                                               option2 ? option2 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.3}",
                                               option3 ? option3 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.4}",
                                               option4 ? option4 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.5}",
                                               option5 ? option5 : "No Data"
                                           )
                                           .replace("{guild.name}", guild?.name as string)
                                           .replace("{guild.id}", interaction.guild?.id as string)
                                           .replace("{member.name}", interaction.user.username)
                                           .replace(
                                               "{member.globalname}",
                                               interaction.user.globalName as string
                                           )
                                           .replace(
                                               "{member.displayname}",
                                               interaction.user.displayName
                                           )
                                           .replace("{member.id}", interaction.user.id)
                                           .replace("{member.tag}", `<@${interaction.user.id}>`)
                                           .replace(
                                               "{handlers.id}",
                                               ticketmenusData.Handlers[0] as string
                                           )
                                           .replace(
                                               "{handlers.tag}",
                                               `<@&${ticketmenusData.Handlers}>`
                                           )
                                       : messageData?.Content
                                           ? messageData.Content.replace(
                                               "{modal.option.1}",
                                               option1 ? option1 : "No Data"
                                           )
                                               .replace(
                                                   "{modal.option.2}",
                                                   option2 ? option2 : "No Data"
                                               )
                                               .replace(
                                                   "{modal.option.3}",
                                                   option3 ? option3 : "No Data"
                                               )
                                               .replace(
                                                   "{modal.option.4}",
                                                   option4 ? option4 : "No Data"
                                               )
                                               .replace(
                                                   "{modal.option.5}",
                                                   option5 ? option5 : "No Data"
                                               )
                                               .replace("{guild.name}", guild?.name as string)
                                               .replace(
                                                   "{guild.id}",
                                                   interaction.guild?.id as string
                                               )
                                               .replace("{member.name}", interaction.user.username)
                                               .replace(
                                                   "{member.globalname}",
                                                   interaction.user.globalName as string
                                               )
                                               .replace(
                                                   "{member.displayname}",
                                                   interaction.user.displayName
                                               )
                                               .replace("{member.id}", interaction.user.id)
                                               .replace("{member.tag}", `<@${interaction.user.id}>`)
                                               .replace(
                                                   "{handlers.id}",
                                                   ticketmenusData.Handlers[0] as string
                                               )
                                               .replace(
                                                   "{handlers.tag}",
                                                   `<@&${ticketmenusData.Handlers}>`
                                               )
                                           : " ",
   
                                   components: [rowbutton, rowbutton2],
                               });
                           } else {
                               let embed = new EmbedBuilder(JSON.parse(embeddata));
   
                               thread.send({
                                   content: messageData.Content
                                       ? messageData.Content.replace(
                                           "{modal.option.1}",
                                           option1 ? option1 : "No Data"
                                       )
                                           .replace(
                                               "{modal.option.2}",
                                               option2 ? option2 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.3}",
                                               option3 ? option3 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.4}",
                                               option4 ? option4 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.5}",
                                               option5 ? option5 : "No Data"
                                           )
                                           .replace("{guild.name}", guild?.name as string)
                                           .replace("{guild.id}", interaction.guild?.id as string)
                                           .replace("{member.name}", interaction.user.username)
                                           .replace(
                                               "{member.globalname}",
                                               interaction.user.globalName as string
                                           )
                                           .replace(
                                               "{member.displayname}",
                                               interaction.user.displayName
                                           )
                                           .replace("{member.id}", interaction.user.id)
                                           .replace("{member.tag}", `<@${interaction.user.id}>`)
                                           .replace(
                                               "{handlers.id}",
                                               ticketmenusData.Handlers[0] as string
                                           )
                                           .replace(
                                               "{handlers.tag}",
                                               `<@&${ticketmenusData.Handlers}>`
                                           )
                                       : messageData?.Content
                                           ? messageData.Content.replace(
                                               "{modal.option.1}",
                                               option1 ? option1 : "No Data"
                                           )
                                               .replace(
                                                   "{modal.option.2}",
                                                   option2 ? option2 : "No Data"
                                               )
                                               .replace(
                                                   "{modal.option.3}",
                                                   option3 ? option3 : "No Data"
                                               )
                                               .replace(
                                                   "{modal.option.4}",
                                                   option4 ? option4 : "No Data"
                                               )
                                               .replace(
                                                   "{modal.option.5}",
                                                   option5 ? option5 : "No Data"
                                               )
                                               .replace("{guild.name}", guild?.name as string)
                                               .replace(
                                                   "{guild.id}",
                                                   interaction.guild?.id as string
                                               )
                                               .replace("{member.name}", interaction.user.username)
                                               .replace(
                                                   "{member.globalname}",
                                                   interaction.user.globalName as string
                                               )
                                               .replace(
                                                   "{member.displayname}",
                                                   interaction.user.displayName
                                               )
                                               .replace("{member.id}", interaction.user.id)
                                               .replace("{member.tag}", `<@${interaction.user.id}>`)
                                               .replace(
                                                   "{handlers.id}",
                                                   ticketmenusData.Handlers[0] as string
                                               )
                                               .replace(
                                                   "{handlers.tag}",
                                                   `<@&${ticketmenusData.Handlers}>`
                                               )
                                           : "",
                                   embeds: [embed],
                                   components: [rowbutton, rowbutton2],
                               });
                           }
                       });
   
                   continue;
               } else {
                   await interaction.guild?.channels
                       .create({
                           name: `${(ticketmenusData?.TicketChannelName as string)
                               .replace("{guild.name}", interaction.guild.name)
                               .replace("{guild.id}", interaction.guild.id)
                               .replace("{member.name}", interaction.user.username)
                               .replace(
                                   "{member.globalname}",
                                   interaction.user.globalName as string
                               )
                               .replace("{member.displayname}", interaction.user.displayName)
                               .replace("{member.id}", interaction.user.id)
                               .replace(
                                   "{random.number}",
                                   Math.floor(Math.random() * 1000).toString()
                               )
                               .replace("{random.tag}", shortUUID.generate())
                               .replace(
                                   "{ticket.count}",
                                   (
                                       (await database.tickets.findMany({
                                           where: {SetupMessageId: interaction.message?.id}
                                       })).length + 1
                                   ).toString()
                               )}`,
                           parent: ticketmenusData?.CategoryId,
                           permissionOverwrites: [
                               {
                                   id: interaction.user.id,
                                   allow: [sendMessages, viewChannel, readMessageHistory],
                               },
                               {
                                   id: interaction.guild.id,
                                   deny: [viewChannel],
                               },
                               {
                                   id: ticketmenusData?.Handlers[0] as string,
                                   allow: [
                                       sendMessages,
                                       viewChannel,
                                       readMessageHistory,
                                       manageMessages,
                                   ],
                               },
                               {
                                   id: client.user.id,
                                   allow: [PermissionsBitField.All],
                               },
                           ],
                       })
                       .then(async (channel) => {
                           interaction.reply({
                               embeds: [
                                   new EmbedBuilder()
                                       .setDescription(`## Ticket has Created ${channel}`)
                                       .setColor("#2B2D31"),
                               ],
                               flags: MessageFlags.Ephemeral,
                           });
                           await database.tickets.create({
                               data: {
                                   GuildId: interaction.guildId,
                                   ThreadId: channel.id,
                                   IsClaimed: false,
                                   UserWhoHasClaimedId: null,
                                   Looked: false,
                                   TicketOwner: interaction.user.id,
                                   Handlers: ticketmenusData.Handlers[0],
                                   SetupMessageId: ticketmenusData.MessageId,
                                   SetupChannelId: interaction.channelId,
                                   TicketId: randomUUID(),
                                   TranscriptChannelId: ticketmenusData.TranscriptChannelId,
                                   TicketSetupId: ticketmenusData.CustomId
                               }
                           });
   
                           if (ticketmenusData?.HasHandlersShadowPing) {
                               const message = channel.send({
                                   content: `<@&${ticketmenusData.Handlers}>`,
                               });
   
                               (await message).delete();
                           }
   
                           if (!messageData?.EmbedJSON) {
                               channel.send({
                                   content: messageData?.Content
                                       ? messageData.Content.replace(
                                           "{modal.option.1}",
                                           option1 ? option1 : "No Data"
                                       )
                                           .replace(
                                               "{modal.option.2}",
                                               option2 ? option2 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.3}",
                                               option3 ? option3 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.4}",
                                               option4 ? option4 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.5}",
                                               option5 ? option5 : "No Data"
                                           )
                                           .replace("{guild.name}", guild?.name as string)
                                           .replace("{guild.id}", interaction.guild?.id as string)
                                           .replace("{member.name}", interaction.user.username)
                                           .replace(
                                               "{member.globalname}",
                                               interaction.user.globalName as string
                                           )
                                           .replace(
                                               "{member.displayname}",
                                               interaction.user.displayName
                                           )
                                           .replace("{member.id}", interaction.user.id)
                                           .replace("{member.tag}", `<@${interaction.user.id}>`)
                                           .replace(
                                               "{handlers.id}",
                                               ticketmenusData.Handlers[0] as string
                                           )
                                           .replace(
                                               "{handlers.tag}",
                                               `<@&${ticketmenusData.Handlers}>`
                                           )
                                       : messageData?.Content?.replace(
                                       "{modal.option.1}",
                                       option1 ? option1 : "No Data"
                                   )
                                       .replace(
                                           "{modal.option.2}",
                                           option2 ? option2 : "No Data"
                                       )
                                       .replace(
                                           "{modal.option.3}",
                                           option3 ? option3 : "No Data"
                                       )
                                       .replace(
                                           "{modal.option.4}",
                                           option4 ? option4 : "No Data"
                                       )
                                       .replace(
                                           "{modal.option.5}",
                                           option5 ? option5 : "No Data"
                                       )
                                       .replace("{guild.name}", guild?.name as string)
                                       .replace("{guild.id}", interaction.guild?.id as string)
                                       .replace(
                                           "{member.name}",
                                           interaction.user.username as string
                                       )
                                       .replace(
                                           "{member.globalname}",
                                           interaction.user.globalName as string
                                       )
                                       .replace(
                                           "{member.displayname}",
                                           interaction.user.displayName
                                       )
                                       .replace("{member.id}", interaction.user.id)
                                       .replace("{member.tag}", `<@${interaction.user.id}>`)
                                       .replace(
                                           "{handlers.id}",
                                           ticketmenusData?.Handlers[0] as string
                                       )
                                       .replace(
                                           "{handlers.tag}",
                                           `<@&${ticketmenusData?.Handlers}>`
                                       ) || " ",
   
                                   components: [rowbutton, rowbutton2],
                               });
                           } else {
                               let embed = new EmbedBuilder(JSON.parse(embeddata as string));
   
                               channel.send({
                                   content: messageData.Content
                                       ? messageData.Content.replace(
                                           "{modal.option.1}",
                                           option1 ? option1 : "No Data"
                                       )
                                           .replace(
                                               "{modal.option.2}",
                                               option2 ? option2 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.3}",
                                               option3 ? option3 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.4}",
                                               option4 ? option4 : "No Data"
                                           )
                                           .replace(
                                               "{modal.option.5}",
                                               option5 ? option5 : "No Data"
                                           )
                                           .replace("{guild.name}", guild?.name as string)
                                           .replace("{guild.id}", interaction.guild?.id as string)
                                           .replace("{member.name}", interaction.user.username)
                                           .replace(
                                               "{member.globalname}",
                                               interaction.user.globalName as string
                                           )
                                           .replace(
                                               "{member.displayname}",
                                               interaction.user.displayName
                                           )
                                           .replace("{member.id}", interaction.user.id)
                                           .replace("{member.tag}", `<@${interaction.user.id}>`)
                                           .replace(
                                               "{handlers.id}",
                                               ticketmenusData.Handlers[0] as string
                                           )
                                           .replace(
                                               "{handlers.tag}",
                                               `<@&${ticketmenusData.Handlers}>`
                                           )
                                       : messageData?.Content?.replace(
                                       "{modal.option.1}",
                                       option1 ? option1 : "No Data"
                                   )
                                       .replace(
                                           "{modal.option.2}",
                                           option2 ? option2 : "No Data"
                                       )
                                       .replace(
                                           "{modal.option.3}",
                                           option3 ? option3 : "No Data"
                                       )
                                       .replace(
                                           "{modal.option.4}",
                                           option4 ? option4 : "No Data"
                                       )
                                       .replace(
                                           "{modal.option.5}",
                                           option5 ? option5 : "No Data"
                                       )
                                       .replace("{guild.name}", guild?.name as string)
                                       .replace("{guild.id}", interaction.guild?.id as string)
                                       .replace("{member.name}", interaction.user.username)
                                       .replace(
                                           "{member.globalname}",
                                           interaction.user.globalName as string
                                       )
                                       .replace(
                                           "{member.displayname}",
                                           interaction.user.displayName
                                       )
                                       .replace("{member.id}", interaction.user.id)
                                       .replace("{member.tag}", `<@${interaction.user.id}>`)
                                       .replace(
                                           "{handlers.id}",
                                           ticketmenusData.Handlers[0] as string
                                       )
                                       .replace(
                                           "{handlers.tag}",
                                           `<@&${ticketmenusData.Handlers}>`
                                       ) || " ",
                                   embeds: [embed],
                                   components: [rowbutton, rowbutton2],
                               });
                           }
                       });
               }
           }
           message?.edit({});
          
         */
    },
};
