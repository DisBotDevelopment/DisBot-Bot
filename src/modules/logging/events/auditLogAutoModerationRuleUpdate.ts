import {
    AuditLogEvent,
    AutoModerationActionType,
    AutoModerationRule,
    AutoModerationRuleEventType,
    AutoModerationRuleTriggerType,
    Events,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {loggingHelper} from "../../../helper/loggingHelper.js";

// Helper functions for readable names
function getTriggerTypeName(type: AutoModerationRuleTriggerType): string {
    const types: Record<AutoModerationRuleTriggerType, string> = {
        [AutoModerationRuleTriggerType.Keyword]: "Keyword",
        [AutoModerationRuleTriggerType.Spam]: "Spam",
        [AutoModerationRuleTriggerType.KeywordPreset]: "Keyword Preset",
        [AutoModerationRuleTriggerType.MentionSpam]: "Mention Spam",
        [AutoModerationRuleTriggerType.MemberProfile]: "Member Profile"
    };
    return types[type] || `Unknown (${type})`;
}

function getEventTypeName(type: AutoModerationRuleEventType): string {
    const types: Record<AutoModerationRuleEventType, string> = {
        [AutoModerationRuleEventType.MessageSend]: "Message Send",
        [AutoModerationRuleEventType.MemberUpdate]: ""
    };
    return types[type] || `Unknown (${type})`;
}

function getActionTypeName(type: AutoModerationActionType): string {
    const types: Record<AutoModerationActionType, string> = {
        [AutoModerationActionType.BlockMessage]: "Block Message",
        [AutoModerationActionType.SendAlertMessage]: "Send Alert Message",
        [AutoModerationActionType.Timeout]: "Timeout User",
        [AutoModerationActionType.BlockMemberInteraction]: "Block Member Interaction"
    };
    return types[type] || `Unknown (${type})`;
}

function formatValue(value: any): string {
    if (value === null || value === undefined) return "None";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") {
        // Check if it's a known enum type
        if (Object.values(AutoModerationRuleTriggerType).includes(value)) {
            return getTriggerTypeName(value as AutoModerationRuleTriggerType);
        }
        if (Object.values(AutoModerationRuleEventType).includes(value)) {
            return getEventTypeName(value as AutoModerationRuleEventType);
        }
        if (Object.values(AutoModerationActionType).includes(value)) {
            return getActionTypeName(value as AutoModerationActionType);
        }
        return String(value);
    }
    if (typeof value === "object") {
        if (Array.isArray(value)) {
            return value.map(v => formatValue(v)).join(", ");
        }
        return JSON.stringify(value, null, 2);
    }
    return String(value);
}

export default {
    name: Events.AutoModerationRuleUpdate,

    async execute(
        oldAutoModerationRule: AutoModerationRule,
        newAutoModerationRule: AutoModerationRule,
        client: ExtendedClient
    ) {
        const guild = newAutoModerationRule.guild;
        const guildId = guild.id;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guildId,
                LoggingEnabled: true
            }
        });

        if (!enabled || !enabled.LoggingEnabled) return;

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guildId
            }
        });

        if (!loggingData || !loggingData.AutoMod) return;

        const webhook = new WebhookClient({url: loggingData.AutoMod});

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

        const changes: string[] = [];

        // Important fields to track
        const importantFields = ["name", "enabled", "triggerType", "eventType", "actions", "triggerMetadata", "exemptRoles", "exemptChannels"];

        for (const key of importantFields) {
            const oldValue = (oldRuleData as any)[key];
            const newValue = (newRuleData as any)[key];

            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
                const formattedOldValue = formatValue(oldValue);
                const formattedNewValue = formatValue(newValue);

                changes.push(
                    `> **${formattedKey}**\n` +
                    `> Before: \`${formattedOldValue}\`\n` +
                    `> After: \`${formattedNewValue}\``
                );
            }
        }

        const changesText = changes.length > 0 ? changes.join("\n\n") : "> *No significant changes detected*";

        const message = [
            `### 🔄 AutoMod Rule Updated`,
            ``,
            `### Executor`,
            ...(executor ? [
                `> <@${executor.id}>`,
                `> **User ID:** \`${executor.id}\``,
                `> **Username:** \`${executor.tag}\``
            ] : [
                `> *Unknown Executor*`
            ]),
            ``,
            `### Rule Details`,
            `> **Name:** \`${newAutoModerationRule.name}\``,
            `> **Rule ID:** \`${newAutoModerationRule.id}\``,
            `> **Currently Enabled:** \`${newAutoModerationRule.enabled ? "Yes" : "No"}\``,
            ``,
            `### Changes`,
            changesText,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
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