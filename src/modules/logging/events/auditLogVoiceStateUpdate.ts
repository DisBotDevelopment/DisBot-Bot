import {
    Events,
    VoiceState,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.VoiceStateUpdate,

    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {ExtendedClient} client
     */
    async execute(
        oldState: VoiceState,
        newState: VoiceState,
        client: ExtendedClient
    ) {
        const guildId = oldState.guild.id;
        const member = newState.member;
        if (!member) return;

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

        if (!loggingData?.Voice) return;

        const webhook = new WebhookClient({url: loggingData.Voice});
        const user = member.user;
        const updateTime = new Date();

        let action = "";
        let details = [];

        if (!oldState.channel && newState.channel) {
            action = "Joined Voice Channel";
            details.push(`> **Channel:** <#${newState.channel.id}>`);
        } else if (oldState.channel && !newState.channel) {
            action = "Left Voice Channel";
            details.push(`> **Channel:** <#${oldState.channel.id}>`);
        } else if (oldState.channel !== newState.channel) {
            action = "Switched Voice Channels";
            details.push(
                `> **From:** <#${oldState.channel?.id}>`,
                `> **To:** <#${newState.channel?.id}>`
            );
        } else if (oldState.mute !== newState.mute) {
            action = newState.mute ? "Server Muted" : "Server Unmuted";
        } else if (oldState.deaf !== newState.deaf) {
            action = newState.deaf ? "Server Deafened" : "Server Undeafened";
        } else if (oldState.streaming !== newState.streaming) {
            action = newState.streaming ? "Started Streaming" : "Stopped Streaming";
        } else if (oldState.selfVideo !== newState.selfVideo) {
            action = newState.selfVideo ? "Started Video" : "Stopped Video";
        }

        // Skip if no relevant changes detected
        if (!action) return;

        await loggingHelper(client,
            [
                `### Voice State Update: ${action}`,
                "",
                `> **User:** <@${user.id}> (\`${user.tag}\`)`,
                ...details,
                `> **Time:** \`${updateTime.toLocaleString()}\``,
                "",
                `-# **User ID:** ${user.id}`,
                `-# **Channel ID:** ${newState.channel?.id || oldState.channel?.id}`
            ].join("\n"),
            webhook,
            JSON.stringify({
                user: {
                    id: user.id,
                    username: user.username,
                    discriminator: user.discriminator
                },
                oldState: {
                    channelId: oldState.channel?.id,
                    mute: oldState.mute,
                    deaf: oldState.deaf,
                    streaming: oldState.streaming,
                    selfVideo: oldState.selfVideo
                },
                newState: {
                    channelId: newState.channel?.id,
                    mute: newState.mute,
                    deaf: newState.deaf,
                    streaming: newState.streaming,
                    selfVideo: newState.selfVideo
                },
                timestamp: updateTime.toISOString()
            }),
            "VoiceStateUpdate"
        );
    }
};