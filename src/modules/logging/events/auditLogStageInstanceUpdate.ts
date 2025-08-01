import {
    Events,
    StageInstance,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.StageInstanceUpdate,

    /**
     * @param {StageInstance} oldStageInstance
     * @param {StageInstance} newStageInstance
     * @param {ExtendedClient} client
     */
    async execute(
        oldStageInstance: StageInstance,
        newStageInstance: StageInstance,
        client: ExtendedClient
    ) {
        const guild = newStageInstance.guild;

        if (!guild) {
            console.error("Guild not found for stage instance:", newStageInstance.id);
            return;
        }

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!loggingData || !loggingData.Stage) return;

        const webhook = new WebhookClient({url: loggingData.Stage});

        // Find changes between old and new instance
        const changes = [];
        if (oldStageInstance.topic !== newStageInstance.topic) {
            changes.push(`> **Topic Changed:** \`${oldStageInstance.topic || "No topic"}\` → \`${newStageInstance.topic || "No topic"}\``);
        }
        if (oldStageInstance.privacyLevel !== newStageInstance.privacyLevel) {
            changes.push(`> **Privacy Level Changed:** \`${oldStageInstance.privacyLevel}\` → \`${newStageInstance.privacyLevel}\``);
        }

        // If no changes detected, skip logging
        if (changes.length === 0) return;

        await loggingHelper(client,
            [
                "### Stage Instance Updated",
                "",
                ...changes,
                "",
                `> **Channel:** <#${newStageInstance.channel?.id}>`,
                `> **Updated At:** \`${new Date().toLocaleString()}\``,
                "",
                `-# **Stage Channel ID:** ${newStageInstance.channel?.id}`
            ].join("\n"),
            webhook,
            JSON.stringify({
                old: oldStageInstance,
                new: newStageInstance
            }),
            "StageInstanceUpdate"
        );
    }
};