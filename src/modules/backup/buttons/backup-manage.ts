import {
    ButtonInteraction,
    MessageFlags,
    StringSelectMenuBuilder, TextDisplayBuilder,
} from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { BackupData } from "../../../systems/backup/types/BackupData.js";
import { ExtendedClient } from "../../../types/client.js";
import { PaginationData } from "../../../types/pagination.js";
import { PaginationBuilder } from "../../../helper/pagination.js";
import { database } from "../../../main/database.js";
import { cli } from "winston/lib/winston/config/index.js";

export default {
    id: "backup-manage",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(
        interaction: ButtonInteraction,
        client: ExtendedClient
    ) {

        if (!client.user) throw new Error("Client User is not defined");
        if (interaction.user.id !== interaction.guild?.ownerId) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Only the server owner can use this button.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 5;
        const data = await database.guildBackups.findMany({
            where: {
                UserId: interaction.user.id
            }
        })

        if (data.length <= 0) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} No Backup found for your user account`, flags: MessageFlags.Ephemeral
            })
        }

        const list = data.slice(currentIndex, currentIndex + 5)
        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => `**Name**: ${l.Name}\n**UUID**: ${l.UUID}\n**Created At**: ${l.CreatedAt.toLocaleString()}`))
                ).join("\n\n"))


        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("backup-manage-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(
                await Promise.all(data.map((embed) => ({
                    label: `${embed.Name} - ${embed.CreatedAt?.toLocaleString()}`,
                    description: `UUID: ${embed.UUID}`,
                    value: embed.UUID,
                    emoji: "<:package:1365715766623604746>"
                })) as any)
            );


        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "backup-manage",
            selectmenu: selectMenu,
            content: embedMessages,
            pageSize: pageSize,
            client: client,
            currentIndex: currentIndex,
            latestUUID: uuid
        }

        await PaginationBuilder(
            paginationData
        )
    }
}
