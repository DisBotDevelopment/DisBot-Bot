import {ButtonInteraction, ChannelType, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {PaginationData} from "../../../types/Pagination.js";
import {database} from "../../../main/database.js";

export default {
    id: "levels-settings-xpdrops-remove",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 5;
        const data = await database.xPDrops.findMany({
            where: {
                GuildId: interaction.guild.id
            }
        })

        if (data.length <= 0) return interaction.reply({
            content: "No drops found.",
            flags: MessageFlags.Ephemeral
        });

        const list = data.slice(currentIndex, currentIndex + 5);
        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => `**UUID:** ${l.UUID}\n**Claim Amount**: ${l.ClaimAmount}\n**Channels**: ${l.ChannelIds.map((c) => `<#${c}>`)}`))).join("\n\n")
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("levels-settings-xpdrops-remove-select")
            .setPlaceholder("Select a Option to delete")
            .addOptions(
                await Promise.all(list.map(async (l) => ({
                    label: `${l.UUID}`,
                    description: `LastSpawned: ${l.LastSpawned}`,
                    value: l.UUID,
                    emoji: "<:package:1365715766623604746>",
                })) as any)
            );

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "levels-settings-xpdrops-remove",
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
};
