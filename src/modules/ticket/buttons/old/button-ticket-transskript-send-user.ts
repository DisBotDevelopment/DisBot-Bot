import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {createTranscript, ExportReturnType} from "discord-html-transcripts";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    GuildChannel,
    GuildMember,
    MessageFlags
} from "discord.js";
import {database} from "../../../../main/database.js";

export default {
    id: "button-ticket-transskript-send-user",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const {guild, member, channel} = interaction;

        const redEmbed = new EmbedBuilder().setColor("#FF0000");

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

        if (
            (member as GuildMember).roles.cache.has(ticketData?.Handlers as string)
        ) {
            const attachments = await createTranscript(channel as any, {
                limit: -1,
                filename: `transscript-${ticketData?.TicketOwner}.html`,
                saveImages: true,
                poweredBy: false,
                returnType: ExportReturnType.Attachment
            });

            const transcriptfile = Buffer.from(
                attachments.attachment.toString(),
                "utf-8"
            );
            const transcriptHTML = transcriptfile.toString("utf-8");

            await database.tickets.update({
                where: {
                    id: ticketData.id
                },
                data: {
                    TranscriptHTML: transcriptHTML,
                }
            })

            const transcripts = ticketData?.Transscript;
            const transcriptsChannel = guild?.channels.cache.get(
                transcripts as string
            );

            const Claimedby = ticketData?.UserhasClaim
                ? `<@${ticketData.UserhasClaim}>`
                : "``none``";

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setLabel("View Online")
                    .setStyle(ButtonStyle.Link)
                    .setEmoji("<:link:1321941111090057248>")
                    .setURL(`https://app.disbot.app/transscripts/${ticketData.CustomId}`)
            );

            const member = guild?.members.cache.get(
                ticketData?.TicketOwner as string
            );
            try {
                await member?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`🎫 Ticket TransScript`)
                            .setDescription(
                                [
                                    `### Channel Infomatoin:`,
                                    `- **Ticket Channel Tag**: <#${
                                        ticketData?.ChannelId
                                            ? ticketData.ChannelId
                                            : ticketData?.ThreadID
                                    }>`,
                                    `- **Channel ID**: \`\`${
                                        ticketData?.ChannelId
                                            ? ticketData.ChannelId
                                            : ticketData?.ThreadID
                                    }\`\``,
                                    ``,
                                    `### Ticket Data:`,
                                    `- **Ticket Owner**: <@${ticketData?.TicketOwner}>`,
                                    `- **Channel Name**: \`\`${
                                        (interaction.channel as GuildChannel).name
                                    }\`\``,
                                    `- **Messages Count**: \`\`${channel?.messages.cache.size}\`\``,
                                    `- **Claimed by**: ${Claimedby}`,
                                    `- **Looked**: \`\`${ticketData?.Looked}\`\``
                                ].join("\n")
                            )
                            .setAuthor({
                                name: member.user.tag,
                                iconURL: member.user.displayAvatarURL()
                            })
                            .setFooter({
                                text: `${interaction.guild?.name} | Ticket TransScript`,
                                iconURL: interaction.guild?.iconURL() ?? undefined
                            })
                            .setTimestamp()
                            .setThumbnail(member.user.displayAvatarURL())
                    ],
                    files: [attachments],
                    components: [row]
                });
            } catch (error) {
                console.error(error);
                if (!client.user) throw new Error("Client not Found!");
                return interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} Failed to Send Transscript to User. User has DMs disabled.`,
                    flags: MessageFlags.Ephemeral
                });
            }
            if (!client.user) throw new Error("Client not Found!");
            interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} Transscript is created to <@${ticketData?.TicketOwner}>`,
                flags: MessageFlags.Ephemeral
            });
        } else {
            if (!client.user) throw new Error("Client not Found!");
            interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} No Permission to Create Transscript. Need <@&${
                    ticketData?.Handlers
                }> Role.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
