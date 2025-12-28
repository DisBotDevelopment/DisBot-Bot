import {
    Events,
    PollAnswer,
    Snowflake,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData?.Poll) return;

        const webhook = new WebhookClient({url: loggingData.Poll});
        const user = await client.users.fetch(userId).catch(() => null);
        const selectedAnswer = answers.get(id);
        const pollUrl = `https://discord.com/channels/${guildId}/${channel.id}/${message.id}`;

        const messageLog = [
            `### 🗳️ Poll Vote Added`,
            ``,
            `### Voter`,
            ...(user ? [
                `> <@${user.id}>`,
                `> **User ID:** \`${user.id}\``,
                `> **Username:** \`${user.tag}\``
            ] : [
                `> *Unknown User*`,
                `> **User ID:** \`${userId}\``
            ]),
            ``,
            `### Poll Details`,
            `> **Question:** \`${question.text || "No question"}\``,
            `> **Poll URL:** [Jump to Poll](${pollUrl})`,
            `> **Channel:** <#${channel.id}>`,
            `> **Total Options:** \`${answers.size}\``,
            ``,
            `### Vote Details`,
            `> **Selected Option ID:** \`${id}\``,
            `> **Option Text:** \`${selectedAnswer?.text || "Unknown"}\``,
            `> **Current Vote Count:** \`${voteCount}\``,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            messageLog,
            webhook,
            JSON.stringify({
                poll: {
                    messageId: message.id,
                    question: question.text,
                    totalAnswers: answers.size,
                    url: pollUrl
                },
                vote: {
                    answerId: id,
                    answerText: selectedAnswer?.text,
                    voteCount: voteCount
                },
                voter: user ? {
                    id: user.id,
                    username: user.username,
                    tag: user.tag
                } : {
                    id: userId
                },
                channel: {
                    id: channel.id,
                    name: channel.name
                },
                timestamp: new Date().toISOString()
            }, null, 2),
            "PollVoteAdd"
        );
    }
};