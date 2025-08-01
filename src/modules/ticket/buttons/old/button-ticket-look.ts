import {ButtonInteraction, ChannelType, GuildChannel, MessageFlags, TextChannel} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiGif, convertToEmojiPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    id: "button-ticket-look",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const {guild, channel} = interaction;


        let ticketData;

        if (interaction.channel?.type !== ChannelType.PrivateThread) {
            ticketData = await database.tickets.findFirst({
                where: {
                    ChannelId: interaction.channel?.id
                }
            });
        } else {
            ticketData = await database.tickets.findFirst({
                where: {
                    ThreadId: interaction.channel.id
                }
            });
        }

        const member = guild?.members.cache.get(interaction.user.id);

        if (member?.roles.cache.has(ticketData?.Handlers as string)) {
            if (ticketData?.Looked == false) {
                if (interaction.channel?.type !== ChannelType.PrivateThread) {
                    ticketData.Looked = true;

                    ticketData.MembersID.forEach((members) => {
                        (channel as GuildChannel).permissionOverwrites.delete(members);
                    });

                    ticketData.MembersID = [];

                    (channel as GuildChannel).permissionOverwrites.edit(
                        ticketData.TicketOwner as string,
                        {
                            AddReactions: false,
                            AttachFiles: false,
                            SendMessages: false
                        }
                    );

                    (channel as GuildChannel).permissionOverwrites.edit(
                        ticketData.Handlers as string,
                        {
                            AddReactions: true,
                            AttachFiles: true,
                            SendMessages: true
                        }
                    );
                    interaction.deferUpdate();

                    if (!client.user) throw new Error("Client not Found!");

                    return (interaction.channel as TextChannel).send({
                        content: `## ${await convertToEmojiPng(
                            "lock",
                            client.user.id
                        )} **Ticket is now looked!**`
                    });
                } else {
                    await interaction.channel.setLocked(true);

                    if (!client.user) throw new Error("Client not Found!");

                    interaction.channel.send({
                        content: `## ${await convertToEmojiPng(
                            "lock",
                            client.user.id
                        )} **Ticket is now looked!**`
                    });

                    interaction.reply({
                        content: `-# **To unlock right click on the channel and click unlock.**`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            } else {
                if (interaction.channel?.type !== ChannelType.PrivateThread) {
                    if (ticketData?.Looked) {
                        ticketData.Looked = false;
                        ticketData.save();
                    }

                    (channel as GuildChannel).permissionOverwrites.edit(
                        ticketData?.TicketOwner as string,
                        {
                            AddReactions: true,
                            AttachFiles: true,
                            SendMessages: true
                        }
                    );

                    (channel as GuildChannel).permissionOverwrites.edit(
                        ticketData?.Handlers as string,
                        {
                            AddReactions: true,
                            AttachFiles: true,
                            SendMessages: true
                        }
                    );

                    return interaction.deferUpdate();
                } else {
                    await interaction.channel.setLocked(false);
                }

                if (!client.user) throw new Error("Client not Found!");

                interaction.channel.send({
                    content: `## ${await convertToEmojiGif(
                        "unlock",
                        client.user.id
                    )} **Ticket is now unlooked!**`
                });
                interaction.deferUpdate();
            }
        } else {
            if (!client.user) throw new Error("Client not Found!");
            interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} You don't have the permission to look this ticket.`,
                flags: MessageFlags.Ephemeral
            });
        }

        await ticketData?.save();

        return;
    }
};
