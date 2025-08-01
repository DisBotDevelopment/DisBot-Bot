import {
    Events,
    PollAnswer,
    Snowflake,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.MessagePollVoteAdd,

    /**
     * @param {PollAnswer} pollAnswer
     * @param {Snowflake} userId
     * @param {ExtendedClient} client
     */
    async execute(
        pollAnswer: PollAnswer,
        userId: Snowflake,
        client: ExtendedClient
    ) {
        const {poll, id, voteCount} = pollAnswer;
        const {message, question, answers} = poll;
        const channel = message.channel;

        if (!channel.isTextBased() || channel.isDMBased()) return;
        const guildId = channel.guildId;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guildId,
                LoggingEnabled: true
            }
        });

        if (!enabled?.LoggingEnabled) return;

        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData?.Poll) return;

        const webhook = new WebhookClient({url: loggingData.Poll});
        const user = await client.users.fetch(userId).catch(() => null);
        const voteTime = new Date();
        const selectedAnswer = answers.get(id);

        await loggingHelper(client,
            [
                "### Poll Vote Added",
                "",
                `> **Poll:** [Jump to Poll](https://discord.com/channels/${guildId}/${channel.id}/${message.id})`,
                `> **Voter:** ${user ? `<@${user.id}> (\`${user.tag}\`)` : "Unknown"}`,
                `> **Question:** \`${question.text || "No question"}\``,
                `> **Selected Option:**`,
                `> - **ID:** \`${id}\``,
                `> - **Text:** \`${selectedAnswer?.text || "Unknown"}\``,
                `> - **Votes:** \`${voteCount}\``,
                `> **Voted At:** \`${voteTime.toLocaleString()}\``,
                "",
                `-# **Voter ID:** ${userId}`,
                `-# **Channel:** <#${channel.id}>`
            ].join("\n"),
            webhook,
            JSON.stringify({
                poll: {
                    messageId: message.id,
                    question: question.text,
                    totalAnswers: answers.size
                },
                vote: {
                    answerId: id,
                    answerText: selectedAnswer?.text,
                    voteCount: voteCount
                },
                voter: user ? {
                    id: user.id,
                    username: user.username,
                    discriminator: user.discriminator
                } : null,
                channel: {
                    id: channel.id,
                    name: channel.name
                },
                timestamp: voteTime.toISOString()
            }),
            "PollVoteAdd"
        );
    }
};