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

export default {
    name: Events.AutoModerationRuleCreate,

    async execute(auditLog: AutoModerationRule, client: ExtendedClient) {
        const {guild} = auditLog;
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

        const ruleCreateLog = await guild.fetchAuditLogs({
            type: AuditLogEvent.AutoModerationRuleCreate
        });

        const rule = ruleCreateLog.entries.first();
        if (!rule) return;

        const executor = rule.executor;
        const ruleTarget = rule.target as unknown as AutoModerationRule;

        const actionsText = ruleTarget.actions
            .map(action => `> **${getActionTypeName(action.type)}**`)
            .join("\n");

        const message = [
            `### 🛡️ AutoMod Rule Created`,
            ``,
            `### Executor`,
            `> <@${executor?.id}>`,
            `> **User ID:** \`${executor?.id}\``,
            `> **Username:** \`${executor?.tag}\``,
            ``,
            `### Rule Details`,
            `> **Name:** \`${ruleTarget.name}\``,
            `> **Rule ID:** \`${ruleTarget.id}\``,
            `> **Enabled:** \`${ruleTarget.enabled ? "Yes" : "No"}\``,
            ``,
            `### Configuration`,
            `> **Trigger Type:** \`${getTriggerTypeName(ruleTarget.triggerType)}\``,
            `> **Event Type:** \`${getEventTypeName(ruleTarget.eventType)}\``,
            ``,
            `### Actions`,
            actionsText,
            ``,
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify(auditLog, null, 2),
            "AutoModerationRuleCreate"
        );
    }
};