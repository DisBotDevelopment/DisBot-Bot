import {
    AuditLogEvent,
    AutoModerationRule,
    Events,
    WebhookClient,
    EmbedBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

export default {
    name: Events.AutoModerationRuleUpdate,

    /**
     * @param {AutoModerationRule} oldAutoModerationRule
     * @param {AutoModerationRule} newAutoModerationRule
     * @param {ExtendedClient} client
     */
    async execute(oldAutoModerationRule, newAutoModerationRule, client) {
        const guild = newAutoModerationRule.guild;
        const guildId = guild.id;

        // Prüfe, ob Logging aktiviert ist via Prisma
        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guildId,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        // Hole Logging-Konfiguration (Webhook-URL) via Prisma
        const loggingData = await database.guildLoggings.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData || !loggingData.AutoMod) return;

        const webhook = new WebhookClient({url: loggingData.AutoMod});

        // Audit Log abfragen für AutoModRuleUpdate
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.AutoModerationRuleUpdate
        });

        const logEntry = auditLogs.entries.first();
        const executor = logEntry?.executor;

        const oldRuleData = oldAutoModerationRule?.toJSON
            ? oldAutoModerationRule.toJSON()
            : oldAutoModerationRule || {};
        const newRuleData = newAutoModerationRule?.toJSON
            ? newAutoModerationRule.toJSON()
            : newAutoModerationRule || {};

        // Finde alle Änderungen
        const changes = [];

        for (const key of Object.keys({...oldRuleData, ...newRuleData})) {
            const oldValue = oldRuleData[key];
            const newValue = newRuleData[key];

            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                const formattedOldValue =
                    typeof oldValue === "object" ? JSON.stringify(oldValue, null, 2) : oldValue;
                const formattedNewValue =
                    typeof newValue === "object" ? JSON.stringify(newValue, null, 2) : newValue;

                changes.push(
                    `**${key.charAt(0).toUpperCase() + key.slice(1)}**:\n` +
                    `\`\`\`diff\n- ${formattedOldValue}\n+ ${formattedNewValue}\n\`\`\``
                );
            }
        }

        const changesText = changes.length > 0 ? changes.join("\n\n") : "No changes.";

        // Erstelle Embed-Text (als String) für loggingHelper
        const message = [
            `### Auto Moderation Rule Updated`,
            `> **Rule Name:** \`${newAutoModerationRule.name}\``,
            `> **Rule ID:** \`${newAutoModerationRule.id}\``,
            `> **Executed By:** ${executor ? `${executor.tag} (\`${executor.id}\`)` : "Unknown"}`,
            `> **Changes:**\n${changesText}`
        ].join("\n");

        // Sende an loggingHelper (der sendet Webhook + JSON als Datei)
        await loggingHelper(client,
            message,
            webhook,
            JSON.stringify(
                {
                    oldRuleData,
                    newRuleData,
                    executor: executor ? {id: executor.id, tag: executor.tag} : null,
                    guildId,
                    event: "AutoModerationRuleUpdate"
                },
                null,
                2
            ),
            "AutoModerationRuleUpdate"
        );
    }
};
