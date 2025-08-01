import "dotenv/config";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, StringSelectMenuInteraction, TextDisplayBuilder } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiGif, convertToEmojiPng } from "../../../helper/emojis.js";
import backup from "../../../systems/backup/index.js";
import { database } from "../../../main/database.js";

export default {
    id: "backup-restore-select",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {

            if (!client.user) throw new Error("Client User is not defined");
            if (interaction.user.id !== interaction.guild?.ownerId) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} Only the server owner can use this command.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            if (!interaction.guild) throw new Error("Guild not found");
            const data = await database.guildBackups.findFirst({
                where: {
                    UUID: value
                }
            });

            if (!data) {
                if (!client.user) throw new Error("Client User is not defined");
                return await interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} No Backup Found`,
                });
            }

            await interaction.update({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`## ${await convertToEmojiPng("package", client.user?.id)} Confirm your backup restore process \n\n-# ⚠️ **Warning**: This will override all your current server settings and data`)
                    ).addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`backup-manage-restore-confirm:${value}`)
                                .setLabel("Confirm")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:check:1320090167444377713>"),
                            new ButtonBuilder()
                                .setCustomId(`backup-manage-restore-cancel`)
                                .setLabel("Cancel")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:x_:1322169218682322955>"),
                        )
                    )
                ]
            });
        }
    }
};
