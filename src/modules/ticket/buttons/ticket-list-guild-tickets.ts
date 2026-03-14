import {
    ButtonInteraction,
    ChannelType,
    MessageFlags,
    StringSelectMenuBuilder,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import type {PaginationData} from "../../../types/Pagination.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {randomUUID} from "crypto";

export default {
    id: "ticket-list-guild-tickets",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {


        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 5;
        const data = await database.tickets.findMany({
            include: {
                TicketSetup: true
            },
            where: {
                GuildId: interaction.guildId ?? "0"
            }
        })

        if (data.length <= 0) return interaction.reply({
            content: "No tickets found.",
            flags: MessageFlags.Ephemeral
        });

        const list = data.slice(currentIndex, currentIndex + 5);
        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => `**Owner:** <@${l.TicketOwnerId}> \n**UUID:** ${l.TicketId}\n`))).join("\n\n")
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("ticket-list-guild-tickets-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(
                await Promise.all(list.map(async (l) => ({
                    label: interaction.guild?.members.cache.get(l.TicketOwnerId)?.displayName || "N/A",
                    description: `UUID: ${l.TicketId} - Channel Type: ${l.ChannelType == ChannelType.GuildCategory ? "Category" : "Thread"}`,
                    value: l.TicketId,
                    emoji: "<:ticket:1400577766205816852>",
                })) as any)
            );

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "ticket-list-guild-tickets",
            selectmenu: selectMenu,
            content: embedMessages,
            pageSize: pageSize,
            client: client,
            currentIndex: currentIndex,
            latestUUID: uuid ?? randomUUID()
        }

        await PaginationBuilder(
            paginationData
        )


    },
};
