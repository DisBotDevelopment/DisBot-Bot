import {ButtonInteraction, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder} from "discord.js";
import {PaginationBuilder} from "../../../helper/pagination.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";

export default {
    id: "autodelete-manage",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 5;
        const data = await database.autoDeletes.findMany({
            where: {
                GuildId: interaction.guildId
            }
        })

        if (data.length <= 0) return interaction.reply({
            content: "No auto-delete setups found.",
            flags: MessageFlags.Ephemeral
        });

        const list = data.slice(currentIndex, currentIndex + 5);
        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => `**Channel Name:** ${l.ChannelId ? `<#${l.ChannelId}>` : "N/A"}\n**UUID:** ${l.UUID}`))).join("\n\n")
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("autodelete-manage-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(
                await Promise.all(list.map(async (l) => ({
                    label: (await interaction.guild?.channels.fetch(l.ChannelId as string))?.name || "Unknown Channel",
                    description: `UUID: ${l.UUID}`,
                    value: l.UUID,
                    emoji: "<:autodelete:1259432932234367069>",
                })) as any)
            );

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "autodelete-manage",
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
