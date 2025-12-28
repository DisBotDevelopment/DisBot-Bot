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

export default {
    name: Events.AutoModerationRuleDelete,

    async execute(
        autoModerationRule: AutoModerationRule,
        client: ExtendedClient
    ) {
        const guild = autoModerationRule.guild;

        const enabled = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id,
                LoggingEnabled: true
            }
        });

        const loggingData = await database.guildLogging.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!enabled || !enabled.LoggingEnabled || !loggingData?.AutoMod) return;

        const webhook = new WebhookClient({url: loggingData.AutoMod});

        const ruleDeleteLog = await guild.fetchAuditLogs({
            type: AuditLogEvent.AutoModerationRuleDelete
        });

        const rule = ruleDeleteLog.entries.first();
        if (!rule) return;

        const executor = rule.executor;
        const ruleName = autoModerationRule?.name ?? "Deleted Rule";
        const ruleId = autoModerationRule?.id ?? "Unknown Rule ID";

        // Build actions text if available
        const actionsText = autoModerationRule?.actions
            ? autoModerationRule.actions
                .map(action => `> **${getActionTypeName(action.type)}**`)
                .join("\n")
            : "> *No actions available*";

        const message = [
            `### 🗑️ AutoMod Rule Deleted`,
            ``,
            `### Executor`,
            `> <@${executor?.id}>`,
            `> **User ID:** \`${executor?.id}\``,
            `> **Username:** \`${executor?.tag}\``,
            ``,
            `### Deleted Rule`,
            `> **Name:** \`${ruleName}\``,
            `> **Rule ID:** \`${ruleId}\``,
            `> **Was Enabled:** \`${autoModerationRule?.enabled ? "Yes" : "No"}\``,
            ``,
            ...(autoModerationRule ? [
                `### Configuration`,
                `> **Trigger Type:** \`${getTriggerTypeName(autoModerationRule.triggerType)}\``,
                `> **Event Type:** \`${getEventTypeName(autoModerationRule.eventType)}\``,
                ``,
                `### Actions`,
                actionsText,
                ``
            ] : []),
            `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n");

        await loggingHelper(
            client,
            message,
            webhook,
            JSON.stringify(autoModerationRule, null, 2),
            "AutoModerationRuleDelete"
        );
    }
};