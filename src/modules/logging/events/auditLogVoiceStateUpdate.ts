import {
    Events,
    VoiceState,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData?.Voice) return;

        const webhook = new WebhookClient({url: loggingData.Voice});
        const user = member.user;

        let emoji = "🔊";
        let action = "";
        const detailsLines: string[] = [];

        if (!oldState.channel && newState.channel) {
            emoji = "📥";
            action = "Joined Voice Channel";
            detailsLines.push(`> **Channel:** <#${newState.channel.id}>`);
        } else if (oldState.channel && !newState.channel) {
            emoji = "📤";
            action = "Left Voice Channel";
            detailsLines.push(`> **Channel:** <#${oldState.channel.id}>`);
        } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            emoji = "🔀";
            action = "Switched Voice Channels";
            detailsLines.push(
                `> **From:** <#${oldState.channel.id}>`,
                `> **To:** <#${newState.channel.id}>`
            );
        } else if (oldState.selfMute !== newState.selfMute) {
            emoji = newState.selfMute ? "🔇" : "🔊";
            action = newState.selfMute ? "Self Muted" : "Self Unmuted";
            if (newState.channel) {
                detailsLines.push(`> **Channel:** <#${newState.channel.id}>`);
            }
        } else if (oldState.selfDeaf !== newState.selfDeaf) {
            emoji = newState.selfDeaf ? "🔇" : "🔊";
            action = newState.selfDeaf ? "Self Deafened" : "Self Undeafened";
            if (newState.channel) {
                detailsLines.push(`> **Channel:** <#${newState.channel.id}>`);
            }
        } else if (oldState.mute !== newState.mute) {
            emoji = newState.mute ? "🔇" : "🔊";
            action = newState.mute ? "Server Muted" : "Server Unmuted";
            if (newState.channel) {
                detailsLines.push(`> **Channel:** <#${newState.channel.id}>`);
            }
        } else if (oldState.deaf !== newState.deaf) {
            emoji = newState.deaf ? "🔇" : "🔊";
            action = newState.deaf ? "Server Deafened" : "Server Undeafened";
            if (newState.channel) {
                detailsLines.push(`> **Channel:** <#${newState.channel.id}>`);
            }
        } else if (oldState.streaming !== newState.streaming) {
            emoji = newState.streaming ? "📺" : "🔊";
            action = newState.streaming ? "Started Streaming" : "Stopped Streaming";
            if (newState.channel) {
                detailsLines.push(`> **Channel:** <#${newState.channel.id}>`);
            }
        } else if (oldState.selfVideo !== newState.selfVideo) {
            emoji = newState.selfVideo ? "📹" : "🔊";
            action = newState.selfVideo ? "Started Video" : "Stopped Video";
            if (newState.channel) {
                detailsLines.push(`> **Channel:** <#${newState.channel.id}>`);
            }
        }

        if (!action) return;

        const message = [
            `### ${emoji} ${action}`,
            ``,
            `### User`,
            `> <@${user.id}>`,
            `> **User ID:** \`${user.id}\``,
            `> **Username:** \`${user.tag}\``,
            ``,
            ...(detailsLines.length > 0 ? [
                `### Details`,
                ...detailsLines,
                ``
            ] : []),
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify({
                user: {
                    id: user.id,
                    username: user.username,
                    tag: user.tag
                },
                action: action,
                oldState: {
                    channelId: oldState.channel?.id,
                    channelName: oldState.channel?.name,
                    mute: oldState.mute,
                    deaf: oldState.deaf,
                    selfMute: oldState.selfMute,
                    selfDeaf: oldState.selfDeaf,
                    streaming: oldState.streaming,
                    selfVideo: oldState.selfVideo
                },
                newState: {
                    channelId: newState.channel?.id,
                    channelName: newState.channel?.name,
                    mute: newState.mute,
                    deaf: newState.deaf,
                    selfMute: newState.selfMute,
                    selfDeaf: newState.selfDeaf,
                    streaming: newState.streaming,
                    selfVideo: newState.selfVideo
                },
                timestamp: new Date().toISOString()
            }, null, 2),
            "VoiceStateUpdate"
        );
    }
};