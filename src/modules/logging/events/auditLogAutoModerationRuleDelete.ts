import {
    AuditLogEvent,
    AutoModerationRule,
    Events,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js"; // Prisma v1
import {loggingHelper} from "../../../helper/loggingHelper.js";

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

        const loggingData = await database.guildLoggings.findFirst({
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

        const changes: string[] = [];

        if (!autoModerationRule) {
            changes.push(`**Rule Status**: **Deleted**`);
        } else {
            const oldRuleData = autoModerationRule.toJSON
                ? (autoModerationRule.toJSON() as AutoModerationRule)
                : autoModerationRule;

            for (const key of Object.keys(oldRuleData)) {
                const value = (oldRuleData as any)[key];
                changes.push(
                    `**${key.charAt(0).toUpperCase() + key.slice(1)}**: \`${value}\``
                );
            }
        }

        const changesText = changes.length > 0 ? changes.join("\n") : "- No changes.";

        const message = [
            `### Auto Moderation Rule Deleted`,
            ``,
            `> **Rule Name**: \`${ruleName}\``,
            `> **Rule ID**: \`${ruleId}\``,
            `> **Deleted By**: ${executor} (\`${executor?.id}\`)`,
            ``,
            `### Details`,
            `${changesText}`,
        ].join("\n");

        await loggingHelper(client,
            message,
            webhook,
            JSON.stringify(autoModerationRule, null, 2),
            "AutoModerationRuleDelete"
        );
    }
};
