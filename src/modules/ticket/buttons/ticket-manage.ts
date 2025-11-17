import {ButtonInteraction, ChannelType, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {PaginationData} from "../../../types/Pagination.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-manage",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 5;
        const data = await database.ticketSetups.findMany({
            where: {
                GuildId: interaction.guildId
            }
        })

        if (data.length <= 0) return interaction.reply({
            content: "No ticket-setups found.",
            flags: MessageFlags.Ephemeral
        });

        const list = data.slice(currentIndex, currentIndex + 5);
        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => `**Channel Name:** ${l.TicketChannelName ?? "N/A"}\n**UUID:** ${l.CustomId}`))).join("\n\n")
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("ticket-manage-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(
                await Promise.all(list.map(async (l) => ({
                    label: l.TicketChannelName || "N/A",
                    description: `UUID: ${l.CustomId} - Channel Type: ${l.ChannelType == ChannelType.GuildCategory ? "Category" : "Thread"}`,
                    value: l.CustomId,
                    emoji: "<:ticket:1400577766205816852>",
                })) as any)
            );

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "ticket-manage",
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
