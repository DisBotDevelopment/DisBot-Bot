import {
    AuditLogEvent,
    AutoModerationRule,
    Events,
    WebhookClient
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js"; // Prisma DB
import {loggingHelper} from "../../../helper/loggingHelper.js";

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

        const loggingData = await database.guildLoggings.findFirst({
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

        const message = [
            `### Auto Moderation Rule Created`,
            ``,
            `> **Rule Name**: \`${ruleTarget.name}\``,
            `> **Rule ID**: \`${ruleTarget.id}\``,
            `> **Created By**: ${executor} (\`${executor?.id}\`)`,
            ``,
            `-# **Executor: ${executor}**`
        ].join("\n");

        await loggingHelper(client,
            message,
            webhook,
            JSON.stringify(auditLog, null, 2),
            "AutoModerationRuleCreate"
        );
    }
};
