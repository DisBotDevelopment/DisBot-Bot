import {
    Events,
    StageInstance,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.StageInstanceCreate,

    /**
     * @param {StageInstance} stageInstance
     * @param {ExtendedClient} client
     */
    async execute(stageInstance: StageInstance, client: ExtendedClient) {
        const guild = stageInstance.guild;

        if (!guild) {
            console.error("Guild not found for stage instance:", stageInstance.id);
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

        await loggingHelper(client,
            [
                "### Stage Instance Created",
                "",
                `> **Topic:** \`${stageInstance.topic || "No topic"}\``,
                `> **Channel:** <#${stageInstance.channel?.id}>`,
                `> **Privacy Level:** \`${stageInstance.privacyLevel || "Unknown"}\``,
                `> **Created At:** \`${new Date(stageInstance.createdTimestamp).toLocaleString()}\``,
                "",
                `-# **Stage Channel ID:** ${stageInstance.channel?.id}`
            ].join("\n"),
            webhook,
            JSON.stringify(stageInstance),
            "StageInstanceCreate"
        );
    }
};