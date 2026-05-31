import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder, TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import Parser from "rss-parser";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import type {PaginationData} from "../../../types/Pagination.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";

export default {
    id: "youtube-manage",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const parser = new Parser();
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        // @ts-ignore
        const currentIndex = parseInt(currentIndexStr) || 0;
        const guildId = interaction.guild?.id;
        const pageSize = 5;

        const data = await database.guildYoutubeNotifications
            .findMany({
                where: {
                    GuildId: guildId
                }
            })

        if (!data.length) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No Youtube Channel Found`, interaction, true)
        }

        const list = data.slice(currentIndex, currentIndex + pageSize);

        const embedMessages = new TextDisplayBuilder()
            .setContent((await Promise.all(list.map(async (l) => {
                const videoData = await parser.parseURL(
                    `https://www.youtube.com/feeds/videos.xml?channel_id=${l.YoutubeChannelId}`
                );
                // @ts-ignore
                const {author} = videoData.items[0];

                return `**Youtube Channel**: ${author} (${l.YoutubeChannelId})\n**Channel Name:** ${l.ChannelId ? `<#${l.ChannelId}>` : "N/A"}\n**UUID:** ${l.UUID}`
            }))).join("\n\n"))


        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("youtube-manage-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(await Promise.all(list.map(async (l) => {
                const videoData = await parser.parseURL(
                    `https://www.youtube.com/feeds/videos.xml?channel_id=${l.YoutubeChannelId}`
                );
                // @ts-ignore
                const {author} = videoData.items[0];

                return {
                    label: `${author} (${l.YoutubeChannelId})`,
                    description: `UUID: ${l.UUID}`,
                    value: l.UUID,
                    emoji: "<:youtube:1432486146868510720>",
                }
            })));

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "youtube-manage:",
            selectmenu: selectMenu,
            content: embedMessages,
            pageSize: pageSize,
            client: client,
            currentIndex: currentIndex,
            // @ts-ignore
            latestUUID: uuid
        };
        await PaginationBuilder(paginationData);
    }
};
