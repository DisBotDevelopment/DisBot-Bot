import {
    ActionRowBuilder, AnyComponentBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    ChannelType, ContainerBuilder, EmbedBuilder, Message,
    MessageFlags,
    ModalBuilder,
    StringSelectMenuBuilder, TextChannel,
    TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {PaginationData} from "../../../types/Pagination.js";
import {database} from "../../../main/database.js";
import {createPollImage, getInteractionData} from "../../../helper/utilityHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {replacePlaceholders} from "../../../main/placeholder.js";
import {randomUUID} from "crypto";

export default {
    id: "polls-disbot-poll-button",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        try {

            const uuid = getInteractionData(interaction, 1)

            let data = await database.pollOptions.findFirst({
                include: {
                    Polls: {
                        include: {
                            PollOptions: true
                        }
                    },
                    PollAnswers: {
                        include: {
                            PollOptions: true,
                            Polls: {
                                include: {
                                    PollOptions: true
                                }
                            }
                        }
                    }
                },
                where: {
                    UUID: uuid
                }
            })

            if (!data) {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} No Poll Data found!`
                })
            }

            const timestamp = Math.floor((data.Polls.CreatedAt.getTime() + (data.Polls.Time ?? 0)) / 1000);

            if (timestamp <= Math.floor(Date.now() / 1000)) {
                const pollMessage = await interaction.channel.messages.fetch(data.Polls.MessageId)
                await pollMessage.edit({
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setEmoji("<:vote:1412727028540506194>")
                                .setLabel("Poll Closed")
                                .setStyle(ButtonStyle.Link)
                                .setURL(pollMessage.url)
                                .setDisabled(true)
                        )
                    ]
                })
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} This Poll has been closed.\n-# You can't vote to this poll`
                })
            }

            if (data.Polls.MultiAnswers == 1 && data.UserIds.includes(interaction.user.id)) {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} You only can vote once.`
                })
            }

            const userVotes = data.Polls.PollOptions.filter((o) => o.UserIds.includes(interaction.user.id))
            if (data.Polls.MultiAnswers + (data.Polls.MultiAnswers == 0 ? 1 : 0) == userVotes.length && !data.UserIds.includes(interaction.user.id)) {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} You have voted ${userVotes.length}/${data.Polls.MultiAnswers} times!`
                })
            }

            // User Voted
            if (data.UserIds.includes(interaction.user.id)) {
                const userEntrys = data.UserIds.filter((i) => i != interaction.user.id)
                await database.pollAnswers.deleteMany({
                    limit: 1,
                    where: {
                        PollOptionId: uuid
                    }
                })
                await database.pollOptions.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            UserIds: {
                                set: userEntrys
                            }
                        }
                    }
                )
                const allEntrys = data.Polls.Entrys.filter((i) => i != interaction.user.id)
                await database.polls.update({
                    where: {
                        UUID: data.Polls.UUID
                    },
                    data: {
                        Entrys: {
                            set: allEntrys
                        }
                    }
                })

                await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} Your vote has been removed!\n-# You already voted for this Option!`
                })
            }

            // User not Voted
            if (!data.UserIds.includes(interaction.user.id)) {
                await database.pollAnswers.create({
                    data: {
                        UUID: randomUUID(),
                        PollId: data.Polls.UUID,
                        PollOptionId: uuid
                    }
                })
                await database.pollOptions.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            UserIds: {
                                push: interaction.user.id
                            }
                        }
                    }
                )
                await database.polls.update({
                    where: {
                        UUID: data.Polls.UUID
                    },
                    data: {
                        Entrys: {
                            push: interaction.user.id
                        }
                    }
                })
            }

            const options = data?.Polls?.PollOptions?.map((o) => {
                return {
                    label: o.Label,
                    description: o.Description,
                    emoji: o.Emoji.length <= 0 ? "<:vote:1412727028540506194>" : o.Emoji,
                    value: o.UUID
                }
            })

            const messageTemplate = await database.messageTemplates.findFirst({
                where: {
                    Name: data.Polls.MessageTemplateId
                }
            })

            data = await database.pollOptions.findFirst({
                include: {
                    Polls: {
                        include: {
                            PollOptions: true
                        }
                    },
                    PollAnswers: {
                        include: {
                            PollOptions: true,
                            Polls: {
                                include: {
                                    PollOptions: true
                                }
                            }
                        }
                    }
                },
                where: {
                    UUID: uuid
                }
            })

            await interaction.guild.members.fetch()
            const placeholderTypes = {
                polls: {
                    options: data?.Polls?.PollOptions?.length
                        ? data.Polls.PollOptions.map((o) =>
                            `- **${o.Emoji ?? ""} ${o.Label}**: ${o.Description ?? "No Description"}`
                        ).join("\n")
                        : "N/A",
                    timestamp: data?.Polls?.CreatedAt
                        ? `${Math.floor((data.Polls.CreatedAt.getTime() + (data.Polls.Time ?? 0)) / 1000)}`
                        : "N/A",
                    maxVotes: data.Polls.Requirements.length <= 0 ? (data.Polls.MultiAnswers + 1) * interaction.guild.members.cache.size : (data.Polls.MultiAnswers + 1) * (await interaction.guild.roles.fetch(data.Polls.Requirements[0])).members.size,
                    totalVotes: data?.PollAnswers?.length ?? 0,
                    participantsCount: data?.Polls?.Entrys?.length ?? 0,
                    winner: data?.Polls?.PollOptions?.length
                        ? (() => {
                            const sorted = [...data.Polls.PollOptions].sort(
                                (a, b) => (b.UserIds?.length ?? 0) - (a.UserIds?.length ?? 0)
                            );
                            const top = sorted[0];
                            return top ? `${top.Emoji ?? ""} ${top.Label}` : "N/A";
                        })()
                        : "N/A",
                    answers: data?.Polls?.PollOptions?.length
                        ? data.Polls.PollOptions.map((o) =>
                            `- **${o.Emoji ?? ""} ${o.Label}**: ${
                                o.UserIds?.length ? o.UserIds.map((i: string) => `<@${i}>`).join(", ") : "N/A"
                            }`
                        ).join("\n")
                        : "N/A",
                    image: await createPollImage({
                        title: "",
                        description: "",
                        options:
                            data.Polls.PollOptions.map((o) => {
                                return {
                                    emoji: o.Emoji ?? "",
                                    label: o.Label,
                                    votes: o.UserIds.length
                                }
                            })
                    })
                },
            }

            const components: ActionRowBuilder<AnyComponentBuilder> [] = []
            if (data.Polls.Type == 1) {
                // BUTTON
                let row: ActionRowBuilder<ButtonBuilder> | null = null;
                let count = 0;

                for (const option of data.Polls.PollOptions) {
                    if (count % 5 === 0) {
                        row = new ActionRowBuilder<ButtonBuilder>();
                        components.push(row);
                    }

                    row!.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`polls-disbot-poll-button:${option.UUID}`)
                            .setLabel(option.Label)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(option.Emoji.length <= 0 ? "<:vote:1412727028540506194>" : option.Emoji)
                    );

                    count++;
                }
            } else if (data.Polls.Type == 2) {
                // SELECTMENU
                components.push(
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("polls-disbot-poll-select")
                            .setPlaceholder("Select a Poll Option")
                            .addOptions(options)
                            .setMinValues(1)
                            .setMaxValues(data.Polls.MultiAnswers >= 26 ? 25 : data.Polls.MultiAnswers)
                    )
                );
            }

            const message = await interaction.channel.messages.fetch(data.Polls.MessageId)

            if (messageTemplate.EmbedJSON) {
                await message.edit({
                    embeds: [new EmbedBuilder(JSON.parse(replacePlaceholders(messageTemplate.EmbedJSON, placeholderTypes)))],
                    content: messageTemplate.Content ? replacePlaceholders(messageTemplate.Content ?? "", placeholderTypes) : "ㅤ",
                    components: components as any
                })
            } else {
                await message.edit({
                    content: messageTemplate.Content ? replacePlaceholders(messageTemplate.Content ?? "", placeholderTypes) : "ㅤ",
                    components: components as any
                })
            }

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("vote")} You voted for this Poll Option.`
            })

        } catch (e) {
            console.error(e);
        }
    }

};
