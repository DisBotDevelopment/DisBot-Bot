import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    Client,
    ContainerBuilder,
    FileBuilder,
    MessageFlags,
    PrivateThreadChannel,
    RoleSelectMenuBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextChannel,
    TextDisplayBuilder,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ticketErrorMessage} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-list-guild-tickets-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        for (const value of interaction.values) {

            const uuid = value
            const data = await database.tickets.findFirst({
                include: {
                    TicketSetup: true
                },
                where: {
                    TicketId: uuid
                }
            })

            if (!data) {
                return await ticketErrorMessage("No Ticket found!", interaction, client)
            }

            let channelName: string
            let channel: PrivateThreadChannel | TextChannel
            if (data.ChannelType == ChannelType.GuildCategory) {

                try {
                    const guildChannel = await interaction.guild.channels.fetch(data.ChannelId) as TextChannel
                    channelName = guildChannel.name
                    channel = guildChannel
                } catch (e) {
                    channel = undefined
                    channelName = "N/A"
                }

            } else if (data.ChannelType == ChannelType.PrivateThread) {
                try {
                    const guildChannelCategory = await interaction.guild.channels.fetch(data.TicketSetup.CategoryId) as TextChannel
                    const guildChannelThread = await guildChannelCategory.threads.fetch(data.ThreadId) as PrivateThreadChannel
                    channelName = guildChannelThread.name
                    channel = guildChannelThread
                } catch (e) {
                    channel = undefined
                    channelName = "N/A"
                }
            } else {
                channel = undefined
            }


            function formatDiscordTimestamp(date: Date) {
                if (date instanceof Date) {
                    const timestamp = Math.floor(date.getTime() / 1000);
                    return `<t:${timestamp}:R> (<t:${timestamp}:F>)`;
                }
                return 'Unknown';
            }


            const container = new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent([
                        `## ${await convertToEmojiToPng("ticket")} Ticket from <@${data.TicketOwnerId}> (${channelName ?? "N/A"})`,
                        ``,
                        `**Ticket Owner**: <@${data.TicketOwnerId}>`,
                        `**Ticket Channel**: ${channel?.url ?? "N/A"}`,
                        `**Ticket Component ID**: ${data.TicketSetupId}`,
                        `**Ticket Status**:`,
                        `- **Claimed**: ${data.IsClaimed ? "Yes" : "No"}`,
                        `  - **Who has Claimed**: ${data.UserWhoHasClaimedId ? `<@${data.UserWhoHasClaimedId}>` : "N/A"}`,
                        `- **Archived**: ${data.IsArchived ? "Yes" : "No"}`,
                        `- **Locked**: ${data.IsLocked ? "Yes" : "No"}`,
                        `- **Closed**: ${data.IsClosed ? "Yes" : "No"}`,
                        `  - **Last Close: ${formatDiscordTimestamp(data.ClosedAt) ?? 'Not closed yet'}**`,
                        `**AddedMember**: ${data.AddedMemberIds.map((m) => `<@${m}>`).join(", ") ?? "N/A"}`,
                        `**Feedback Channel**: ${data.TicketFeedbackChannelId ? `<#${data.TicketFeedbackChannelId}>` : "N/A"}`,
                        `**Created At**: ${formatDiscordTimestamp(data.CreatedAt)}`
                    ].join("\n"))
                );

            if (data.TranscriptJSON) {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("### Transcript")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setChannelTypes(
                                    ChannelType.GuildText,
                                    ChannelType.PublicThread,
                                    ChannelType.PrivateThread,
                                    ChannelType.AnnouncementThread,
                                    ChannelType.GuildAnnouncement
                                )
                                .setPlaceholder("Send to Channel")
                                .setCustomId("ticket-tickets-transcript-channel:" + uuid)
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            new UserSelectMenuBuilder()
                                .setPlaceholder("Send to Member")
                                .setCustomId("ticket-tickets-transcript-member:" + uuid)
                        )
                    )
                    .addFileComponents(
                        new FileBuilder().setURL("attachment://transcript.html")
                    )
                    .addFileComponents(
                        new FileBuilder().setURL("attachment://transcript.json")
                    );

            }

            container
                .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("ticket-tickets-delete:" + uuid)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("<:trash:1259432932234367069>")
                        .setLabel("Delete Ticket Data"),
                    new ButtonBuilder()
                        .setURL(channel?.url ?? "https://discord.com/404")
                        .setStyle(ButtonStyle.Link)
                        .setEmoji("<:link:1321941111090057248>")
                        .setLabel("View Ticket Channel")
                ))

            await interaction.reply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [container],
                files: data.TranscriptJSON
                    ? [
                        new AttachmentBuilder(Buffer.from(data.TranscriptHTML, "utf-8")).setName("transcript.html"),
                        new AttachmentBuilder(Buffer.from(data.TranscriptJSON, "utf-8")).setName("transcript.json")
                    ]
                    : []
            });


        }
    }
}
