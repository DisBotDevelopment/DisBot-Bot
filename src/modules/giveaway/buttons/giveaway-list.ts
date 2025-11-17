import {
    ActionRowBuilder,
    ButtonBuilder, ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder, TextDisplayBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {PaginationData} from "../../../types/Pagination.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";

export default {
    id: "giveaway-list",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(
        interaction: ButtonInteraction,
        client: ExtendedClient
    ) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const guildId = interaction.guild?.id;
        const pageSize = 5;


        const data = await database.giveaways
            .findMany({
                where: {
                    GuildId: guildId
                }
            })

        if (!data.length) {
            if (!client.user) throw new Error("Client User is not defined");
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} No Button Found`,
                flags: MessageFlags.Ephemeral
            });
        }

        const list = data.slice(currentIndex, currentIndex + 5);
        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => [
                    `**Prize**: \`${l.Prize}\``,
                    `**Message**: https://discord.com/channels/${interaction.guild?.id}/${l.ChannelId}/${l.MessageId}`,
                    `**UUID**: \`\`\`${l.UUID}\`\`\``
                ].join("\n")))).join("\n\n")
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("commands-manager-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(
                await Promise.all(list.map(async (l) => ({
                    label: l.Prize + " - " + l.CreatedAt.toLocaleString(),
                    description: `UUID: ${l.UUID}`,
                    value: l.UUID,
                    emoji: "<:giveaway:1366020996934668419>"
                })) as any)
            );

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "commands-manager",
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