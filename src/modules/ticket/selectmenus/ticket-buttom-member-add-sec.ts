import {Client, MessageFlags, TextChannel, UserSelectMenuInteraction} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-buttom-member-add-sec",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const {channel} = interaction;

        for (const value of interaction.values) {
            const ticket = await database.tickets.findFirst({
                where: {
                    ChannelId: interaction.channel?.id
                }
            });

            if (!ticket) {
                if (!client.user) throw new Error("No User found.");
                interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} This is not a ticket channel.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            if (!interaction.guild) throw new Error("No Guild found.");
            if (!client.user) throw new Error("No User found.");
            if (!interaction.channel) throw new Error("No Channel found.");

            const member = interaction.guild.members.cache.get(value);

            const ticketData = await database.tickets.findFirst({
                where: {
                    ChannelId: interaction.channel?.id
                }
            });

            if (!ticketData)
                interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} This is not a ticket channel.`,
                    flags: MessageFlags.Ephemeral
                });

            if (ticketData.AddedMemberIds.includes(member?.id))
                interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} This member is already in the ticket.`,
                    flags: MessageFlags.Ephemeral
                });

            await database.tickets.updateMany({
                where: {
                    ChannelId: interaction.channel.id
                },
                data: {
                    AddedMemberIds: {
                        push: member.id
                    }
                }
            });

            (channel as TextChannel).permissionOverwrites.edit(member?.id as string, {
                SendMessages: true,
                ViewChannel: true,
                ReadMessageHistory: true
            });

            interaction.update({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} You have successfully added <@${value}> to the ticket.`,
            });
        }
    }
};
