import "dotenv/config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuInteraction, TextDisplayBuilder
} from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { BackupData } from "../../../systems/backup/types/BackupData.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
    id: "backup-manage-select",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        if (!client.user) throw new Error("Client User is not defined");
        for (const value of interaction.values) {
            if (!interaction.guild) throw new Error("Guild not found");
            const data = await database.guildBackups.findFirst({
                where: {
                    UUID: value
                }
            });

            if (!data) {
                await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} No Backup Found`,
                });
            }

            const jsonBackupData = JSON.parse(data.BackupJSON as string) as BackupData

            await interaction.update({
                flags: MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent([
                                `## ${await convertToEmojiPng("package", client.user.id)} Backup Details`,
                                ``,
                                `> **Name:** ${jsonBackupData.name ?? "N/A"}`,
                                `> **UUID:** ${data.UUID ?? "N/A"}`,
                                `> **Created At:** ${data.CreatedAt?.toLocaleString() ?? "N/A"}`,
                                `### Backup Contents`,
                                `> ${await convertToEmojiPng("user", client.user.id)} **Members:** ${jsonBackupData.members?.length ?? "N/A"}`,
                                `> ${await convertToEmojiPng("role", client.user.id)} **Roles:** ${jsonBackupData.roles?.length ?? "N/A"}`,
                                `> ${await convertToEmojiPng("text", client.user.id)} **Channels:** ${(jsonBackupData.channels?.categories?.length ?? 0) + (jsonBackupData.channels?.others?.length ?? 0) || "N/A"
                                }`,
                                `> ${await convertToEmojiPng("smile", client.user.id)} **Emojis:** ${jsonBackupData.emojis?.length ?? "N/A"}`,
                            ].join("\n"))
                    ).addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`backup-manage-restore:${value}`)
                                .setLabel("Restore Backup")
                                .setStyle(2)
                                .setEmoji("<:refresh:1260140823106813953>"),
                            new ButtonBuilder()
                                .setCustomId(`backup-delete:${value}`)
                                .setLabel("Delete Backup")
                                .setStyle(2)
                                .setEmoji("<:trash:1259432932234367069>"),
                            new ButtonBuilder()
                                .setCustomId(`backup-download:${value}`)
                                .setLabel("Download Backup")
                                .setStyle(2)
                                .setEmoji("<:download:815575488318799903>"),
                        ))
                ],
            })
        }
    }
};
