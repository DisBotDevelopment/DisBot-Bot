import {Client, MessageFlags, TextChannel, UserSelectMenuInteraction,} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-buttom-member-remove-sec",

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
                if (!client.user) throw new Error("Client is not extended");
                interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} This is not a ticket channel.`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            const member = interaction.guild?.members.cache.get(value);
            if (!client.user) throw new Error("Client is not extended");
            if (!ticket.AddedMemberIds.includes(member?.id))
                interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} This member is not in the ticket.`,
                    flags: MessageFlags.Ephemeral,
                });

            await database.tickets.updateMany({
                where: {
                    ChannelId: interaction.channel.id
                },
                data: {
                    AddedMemberIds: {
                        set: ticket.AddedMemberIds.filter((id) => id !== member?.id)
                    }
                }
            });

            await (channel as TextChannel).permissionOverwrites.delete(member?.id as string);

            interaction.update({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} You have successfully removed <@${member?.id}> from the ticket.`,
            });
        }
    },
};
