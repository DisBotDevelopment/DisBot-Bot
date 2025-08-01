import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    AuditLogEvent,
    PermissionFlagsBits,
} from "discord.js";
import pkg from "short-uuid";
const { uuid } = pkg;
import { ExtendedClient } from "../../../../types/client.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
    subCommand: "moderation.user", options: {
        once: false,
        permission: PermissionType.Moderation,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ViewAuditLog],
        userPermissions: [PermissionFlagsBits.ViewAuditLog],
        userHasOnePermission: true,
        isGuildOwner: false,
    },

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
        const user = interaction.options.getUser("user", true);
        const member = await interaction.guild?.members.fetch(user.id).catch(() => null);

        const auditlog = await interaction.guild?.fetchAuditLogs({
            limit: 100,
            user: user,
        });

        // Audit log entries aufbereiten
        const relevantLogs = auditlog?.entries
            .filter((entry) => entry.targetId === user.id)
            .map((entry) => ({
                type: AuditLogEvent[entry.action] || `UNKNOWN (${entry.action})`,
                executorId: entry.executorId,
                executorTag: entry.executor?.tag ?? "Unknown",
                createdAt: entry.createdAt.toISOString(),
                reason: entry.reason || "No reason provided.",
            })) ?? [];

        const embed = new EmbedBuilder()
            .setTitle("👤 User Information")
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .setColor(0x5865f2)
            .addFields([
                { name: "Username", value: `${user} (${user.id})`, inline: false },
                { name: "Bot?", value: user.bot ? "Yes" : "No", inline: true },
                {
                    name: "Created At",
                    value: `<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>`,
                    inline: true,
                },
                {
                    name: "Joined At",
                    value: member?.joinedTimestamp
                        ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
                        : "Unknown",
                    inline: true,
                },
                {
                    name: "Roles",
                    value: member?.roles.cache.map((r) => `<@&${r.id}>`).join(", ") || "None",
                    inline: false,
                },
                {
                    name: "Audit Logs",
                    value:
                        relevantLogs.length > 0
                            ? relevantLogs
                                .map(
                                    (entry) =>
                                        `\`${entry.type}\` <t:${Math.floor(
                                            new Date(entry.createdAt).getTime() / 1000
                                        )}:R> by <@${entry.executorId}>`
                                )
                                .join("\n")
                            : "No relevant audit logs found.",
                    inline: false,
                },
            ]);

        const button = new ButtonBuilder()
            .setCustomId(`moderation-export-logs-${user.id}`)
            .setLabel("📄 Export Audit Logs")
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
        });

        const collector = interaction.channel?.createMessageComponentCollector({
            filter: (i) =>
                i.customId === `moderation-export-logs-${user.id}` && i.user.id === interaction.user.id,
            time: 5 * 60 * 1000,
        });

        collector?.on("collect", async (btnInteraction: ButtonInteraction) => {
            const json = JSON.stringify(relevantLogs, null, 2);
            const buffer = Buffer.from(json, "utf-8");

            const attachment = new AttachmentBuilder(buffer, {
                name: `auditlog_${user.id}.json`,
                description: `Audit log export for ${user.tag}`,
            });

            await btnInteraction.reply({
                content: `📁 Here is your Audit-Log-Export from ${user}`,
                files: [attachment],
                flags: MessageFlags.Ephemeral,
            });
        });
    },
};
