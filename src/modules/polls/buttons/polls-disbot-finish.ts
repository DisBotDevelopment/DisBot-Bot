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
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";
import {createPollImage, getInteractionData} from "../../../helper/utilityHelper.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {replacePlaceholders} from "../../../main/placeholder.js";

export default {
    id: "polls-disbot-finish",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = getInteractionData(interaction, 1)

        const data = await database.polls.findFirst({
            include: {
                PollOptions: true,
                PollAnswers: true
            },
            where: {
                UUID: uuid
            }
        })
        if (!data) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} No Poll Data found!`
            })
        }

        if (data.PollOptions.length <= 0) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} No Poll Options found!`
            })
        }

        const options = data.PollOptions.map((o) => {
            return {
                label: o.Label,
                description: o.Description,
                emoji: o.Emoji.length <= 0 ? "<:vote:1412727028540506194>" : o.Emoji,
                value: o.UUID
            }
        })

        const messageTemplate = await database.messageTemplates.findFirst({
            where: {
                Name: data.MessageTemplateId
            }
        })

        await interaction.guild.members.fetch()
        const placeholderTypes = {
            polls: {
                options: data?.PollOptions?.length
                    ? data.PollOptions.map((o) =>
                        `- **${o.Emoji ?? ""} ${o.Label}**: ${o.Description ?? "No Description"}`
                    ).join("\n")
                    : "N/A",
                timestamp: data?.CreatedAt
                    ? `${Math.floor((data.CreatedAt.getTime() + (data.Time ?? 0)) / 1000)}`
                    : "N/A",
                maxVotes: data.Requirements.length <= 0 ? (data.MultiAnswers + 1) * interaction.guild.members.cache.size : (data.MultiAnswers + 1) * (await interaction.guild.roles.fetch(data.Requirements[0])).members.size,
                totalVotes: data?.PollAnswers?.length ?? 0,
                participantsCount: data?.Entrys?.length ?? 0,
                winner: data?.PollOptions?.length
                    ? (() => {
                        const sorted = [...data.PollOptions].sort(
                            (a, b) => (b.UserIds?.length ?? 0) - (a.UserIds?.length ?? 0)
                        );
                        const top = sorted[0];
                        return top ? `${top.Emoji ?? ""} ${top.Label}` : "N/A";
                    })()
                    : "N/A",
                answers: data?.PollOptions?.length
                    ? data.PollOptions.map((o) =>
                        `- **${o.Emoji ?? ""} ${o.Label}**: ${
                            o.UserIds?.length ? o.UserIds.map((i: string) => `<@${i}>`).join(", ") : "N/A"
                        }`
                    ).join("\n")
                    : "N/A",
                image: await createPollImage({
                    title: "",
                    description: "",
                    options:
                        data.PollOptions.map((o) => {
                            return {
                                emoji: o.Emoji ?? "",
                                label: o.Label,
                                votes: o.UserIds.length
                            }
                        })
                })
            },
        }

        const components
            :
            ActionRowBuilder<AnyComponentBuilder> [] = []

        if (data.Type == 1) {
            // BUTTON
            let row: ActionRowBuilder<ButtonBuilder> | null = null;
            let count = 0;

            for (const option of data.PollOptions) {
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
        } else if (data.Type == 2) {
            // SELECTMENU
            components.push(
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("polls-disbot-poll-select")
                        .setPlaceholder("Select a Poll Option")
                        .addOptions(options)
                        .setMinValues(1)
                        .setMaxValues(data.MultiAnswers >= 26 ? 25 : data.MultiAnswers)
                )
            );
        }

        let message: Message
        if (messageTemplate.EmbedJSON) {
            message = await (interaction.channel as TextChannel).send({
                embeds: [new EmbedBuilder(JSON.parse(replacePlaceholders(messageTemplate.EmbedJSON, placeholderTypes)))],
                content: messageTemplate.Content ? replacePlaceholders(messageTemplate.Content ?? "", placeholderTypes) : "ㅤ",
                components: components as any
            })
        } else {
            message = await (interaction.channel as TextChannel).send({
                content: messageTemplate.Content ? replacePlaceholders(messageTemplate.Content ?? "", placeholderTypes) : "ㅤ",
                components: components as any
            })
        }

        await database.polls.update({
            where: {
                UUID: uuid
            },
            data: {
                MessageId: message.id,
                ChannelId: message.channelId
            }
        })

        await interaction.update({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiPng("vote", client.user.id)} Poll has been sent!`,
                                ].join("\n")
                            )
                    )
            ]
        })
    }
}
