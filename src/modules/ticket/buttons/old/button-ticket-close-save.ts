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
    MessageFlags,
    Snowflake,
    TextChannel,
    ThreadChannel,
} from "discord.js";
import pkg from "short-uuid";
import {database} from "../../../../main/database.js";

const {uuid} = pkg;

export default {
    id: "button-ticket-close-save",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const {guild, channel} = interaction;

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

        const member = interaction.guild?.members.cache.get(interaction.user.id);

        if (member?.roles.cache.has(ticketData?.Handlers as string)) {
            const attachments = await createTranscript(channel as any, {
                limit: -1,
                filename: `transscript-${ticketData?.TicketOwner}.html`,
                saveImages: true,
                poweredBy: false,
                returnType: ExportReturnType.Attachment,
            });

            const uuids = uuid();
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

            const member = guild?.members.cache.get(
                ticketData?.TicketOwner as string
            );

            if (!client.user) throw new Error("Client not Found!");

            if (!transcriptsChannel) {
                interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} The ticket transscript channel is not found. Please check the settings and try again.`,
                    flags: MessageFlags.Ephemeral,
                });

                (interaction.channel as ThreadChannel).members
                    .remove(ticketData?.TicketOwner as Snowflake)
                    .catch(async (error) => {
                        if (!client.user) throw new Error("Client not Found!");

                        return interaction.reply({
                            content: `## ${await convertToEmojiPng(
                                "error",
                                client.user.id
                            )} Error from Ticket System. Please check my permissions/settings and try again.`,
                            flags: MessageFlags.Ephemeral,
                        });
                    });
            }

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setLabel("View Online")
                    .setStyle(ButtonStyle.Link)
                    .setEmoji("<:link:1321941111090057248>")
                    .setURL(`https://app.disbot.app/transscripts/${uuids}`)
            );
            await (transcriptsChannel as TextChannel).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`🎫 Ticket TransScript`)
                        .setDescription(
                            [
                                `### Channel Infomatoin:`,
                                `- **Ticket Channel Tag**: <#${ticketData?.ChannelId
                                    ? ticketData.ChannelId
                                    : ticketData?.ThreadID
                                }>`,
                                `- **Channel ID**: \`\`${ticketData?.ChannelId
                                    ? ticketData.ChannelId
                                    : ticketData?.ThreadID
                                }\`\``,
                                ``,
                                `### Ticket Data:`,
                                `- **Ticket Owner**: <@${ticketData?.TicketOwner}>`,
                                `- **Channel Name**: \`\`${(interaction.channel as TextChannel).name
                                }\`\``,
                                `- **Messages Count**: \`\`${channel?.messages.cache.size}\`\``,
                                `- **Claimed by**: ${Claimedby}`,
                                `- **Looked**: \`\`${ticketData?.Looked}\`\``,
                                ``,
                                `### Ticket Panel Data:`,
                                `- **Handler**: <@&${ticketData?.Handlers}>`,
                            ].join("\n")
                        )
                        .setAuthor({
                            name: member?.user.tag ? member.user.tag : "",
                            iconURL: member?.user.displayAvatarURL(),
                        })
                        .setFooter({
                            text: `Ticket Transscript`,
                            iconURL: interaction.guild?.iconURL() ?? undefined,
                        })
                        .setTimestamp()
                        .setThumbnail(
                            (member?.user.displayAvatarURL() as string) ?? undefined
                        ),
                ],
                files: [attachments],
                components: [row],
            });

            interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} Transscript is created ${transcriptsChannel}`,
                flags: MessageFlags.Ephemeral,
            });

            interaction.channel?.delete().catch(async (error) => {
                if (!client.user) throw new Error("Client not Found");
                return interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} Error from Ticket System. Please check my permissions/settings and try again.`,
                    flags: MessageFlags.Ephemeral,
                });
            });
        } else {
            if (!client.user) throw new Error("Client not Found");
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} You are not allowed to close this ticket.`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
