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
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {PaginationData} from "../../../types/pagination.js";

export default {
    id: "twitch-manage",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const guildId = interaction.guild?.id;
        const pageSize = 5;

        const data = await database.guildTwitchNotifications
            .findMany({
                where: {
                    GuildId: guildId
                }
            })

        if (!data.length) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No Twitch Streamer Found`, interaction, true)
        }

        const list = data.slice(currentIndex, currentIndex + pageSize);

        const embedMessages = new TextDisplayBuilder()
            .setContent((await Promise.all(list.map(async (l) => `**Twitch Channel**: ${l.TwitchChannelName}\n**Channel Name:** ${l.ChannelId ? `<#${l.ChannelId}>` : "N/A"}\n**UUID:** ${l.UUID}`))).join("\n\n"));


        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("twitch-manage-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(await Promise.all(list.map(async (l) => ({
                label: l.TwitchChannelName,
                description: `UUID: ${l.UUID}`,
                value: l.UUID,
                emoji: "<:s_twitch02:1432486211611787385>",
            }))));

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "twitch-manage:",
            selectmenu: selectMenu,
            content: embedMessages,
            pageSize: pageSize,
            client: client,
            currentIndex: currentIndex,
            latestUUID: uuid
        };
        await PaginationBuilder(paginationData);
    }
};
