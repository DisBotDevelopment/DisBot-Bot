import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    GuildChannel,
    MessageFlags,
    PermissionFlagsBits,
    ThreadChannel
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    id: "button-ticket-close-archive",

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

        if (!client.user) throw new Error("Client not Found!");

        const embed = new EmbedBuilder()
            .setDescription(
                `## ${await convertToEmojiPng(
                    "box",
                    client.user.id
                )} Ticket is now archived!`
            )
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setCustomId("button-ticket-close-archive-delete")
                .setLabel("Delete Ticket")
                .setEmoji("<:trash:1259432932234367069>")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(
                    "button-ticket-close-archive-reopen:" + interaction.channel?.id
                )
                .setLabel("Reopen Ticket")
                .setEmoji("<:reopen:1289668008503148649>")
                .setStyle(ButtonStyle.Success)
        ]);

        if ((interaction.channel as GuildChannel).name.startsWith("archived")) {
            return await interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "info",
                    client.user.id
                )} Ticket is already archived!`,
                flags: MessageFlags.Ephemeral
            });
        }

        if ((interaction.channel as GuildChannel).name.startsWith("reopened")) {
            return await interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} Ticket is already reopened!`,
                flags: MessageFlags.Ephemeral
            });
        } else {
            const TicketChannelName = (interaction.channel as GuildChannel).name;
            await (interaction.channel as GuildChannel).setName(
                `archived-${TicketChannelName}`
            );
        }

        await interaction.message.delete();

        if (interaction.channel?.type === ChannelType.GuildText) {
            await interaction.channel.permissionOverwrites.edit(
                ticketData?.TicketOwner as string,
                {
                    ViewChannel: false
                }
            );

            await interaction.channel.permissionOverwrites.edit(
                interaction.guild?.roles.everyone.id as string,
                {
                    ViewChannel: false
                }
            );

            if (ticketData?.MembersID) {
                const members = ticketData.MembersID;

                members.forEach(async (member) => {
                    await (interaction.channel as GuildChannel).permissionOverwrites.edit(
                        member,
                        {
                            ViewChannel: false
                        }
                    );
                });
            }

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId("button-ticket-close-archive-move")
                    .setLabel("Move Ticket")
                    .setEmoji("<:move:1289668008503148649>")
                    .setStyle(ButtonStyle.Primary)
            );

            return await interaction.reply({
                embeds: [embed],
                components: [row]
            });
        } else {
            await interaction.reply({
                embeds: [embed],
                components: [row]
            });
            await (interaction.channel as ThreadChannel).setArchived(true);
        }
    }
};
