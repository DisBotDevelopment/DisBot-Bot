import {
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    GuildChannel,
    GuildDefaultMessageNotifications,
    GuildMember,
    PermissionFlagsBits,
    TextChannel,
    ThreadChannel
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {database} from "../../../../main/database.js";

export default {
    id: "button-ticket-close-archive-reopen",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
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
        await interaction.message.delete();
        const channel = interaction.channel;
        if (channel?.type === ChannelType.GuildText) {
            await (interaction.channel as TextChannel).permissionOverwrites.edit(
                ticketData?.TicketOwner as string,
                {
                    ViewChannel: true
                }
            );

            await (interaction.channel as TextChannel).permissionOverwrites.edit(
                interaction.guild?.roles.everyone.id as string,
                {
                    ViewChannel: false
                }
            );

            if (ticketData?.MembersID) {
                const members = ticketData.MembersID;

                members.forEach(async (member: GuildMember) => {
                    await (interaction.channel as TextChannel).permissionOverwrites.edit(
                        member,
                        {
                            ViewChannel: true
                        }
                    );
                });
            }
        } else {
            await (interaction.channel as ThreadChannel).setArchived(false);
            await (channel as ThreadChannel).members.add(ticketData?.TicketOwner as string);
        }

        const TicketChannelName = (interaction.channel as GuildChannel).name;
        await (interaction.channel as GuildChannel).setName(
            `${TicketChannelName.replace("archived", "reopened")}`
        );

        (interaction.channel as TextChannel)
            .send({
                content: `<@${ticketData?.TicketOwner}>`
            })
            .then((msg) => {
                msg.delete();
            });

        interaction.reply({
            content: "-# **Ticket Reopened and meber has been notified**"
        });
    }
};
