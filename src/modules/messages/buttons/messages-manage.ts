import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder,
    TextDisplayBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationBuilder} from "../../../helper/pagination.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-manage",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ButtonInteraction,
        client: ExtendedClient
    ) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 5;
        const data = await database.messageTemplates.findMany({
            where: {
                GuildId: interaction.guildId
            }
        })

        if (!data || data.length === 0) {
            return interaction.reply({
                content: "No message templates found.",
                ephemeral: true
            });
        }

        const list = data.slice(currentIndex, currentIndex + 5);
        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => `**Template Name:** ${l.Name ? `${l.Name}` : "N/A"}\n**UUID:** ${l.Name}`))).join("\n\n")
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("message-manage-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(
                await Promise.all(list.map(async (l) => ({
                    label: l.Name || "N/A",
                    emoji: "<:message:1322252985702551767>",
                    description: `Message Template`,
                    value: l.Name
                })) as any)
            );

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "messages-manage",
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
