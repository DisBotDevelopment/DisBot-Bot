import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import Parser from "rss-parser";
import {database} from "../../../main/database.js";

export default {
    id: "youtube-manage",

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

        try {
            const allEmbeds = await database.youtubeNotifications
                .findMany({
                    where: {
                        GuildId: guildId
                    }
                })

            if (!allEmbeds.length) {
                return interaction.reply({
                    content: "## No YouTube Channel Found",
                    flags: MessageFlags.Ephemeral
                });
            }

            let channelname = "";
            const embedsList = allEmbeds.slice(currentIndex, currentIndex + pageSize);
            const embedMessages = await Promise.all(
                embedsList.map(async (embed) => {

                    const parser = new Parser();
                    let videodata = await parser.parseURL(
                        `https://www.youtube.com/feeds/videos.xml?channel_id=${embed.YoutubeChannelId}`
                    );
                    let {author} = videodata.items[0];
                    channelname = author;
                    return new EmbedBuilder()
                        .setColor("#2B2D31")
                        .setDescription(
                            [
                                `**Channelname**:   \`${author}\` (ID: \`${embed.YoutubeChannelId}\`)`,
                                `**Channel**: <#${embed.ChannelId}>`,
                                `**UUID**: \`\`\`${embed.UUID}\`\`\``
                            ].join("\n")
                        );
                })
            );
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("youtube-manage-select")
                .setPlaceholder("Select a Option to manage")
                .addOptions(
                    embedsList.map((embed) => ({
                        label: `${channelname} (ID: ${embed.YoutubeChannelId})`,
                        description: `UUID: ${embed.UUID}`,
                        value: embed.UUID
                    })) as any
                );

            const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:arrowbackregular24:1301119279088799815>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`youtube-manage:${uuid}:${currentIndex - pageSize}`)
                    .setDisabled(currentIndex === 0),
                new ButtonBuilder()
                    .setEmoji("<:next:1287457822526935090>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`youtube-manage:${uuid}:${currentIndex + pageSize}`)
                    .setDisabled(currentIndex + pageSize >= allEmbeds.length)
            );

            const selectMenuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

            await interaction.reply({
                embeds: embedMessages,
                components: [navigationRow, selectMenuRow],
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.error("Error:", error);
            await interaction.reply({
                content:
                    "## An error occurred while fetching the menus. Please try again later",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
