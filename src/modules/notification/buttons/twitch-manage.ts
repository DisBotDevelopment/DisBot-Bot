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
import {database} from "../../../main/database.js";

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

        try {
            const allEmbeds = await database.twitchNotifications
                .findMany({
                    where: {
                        GuildId: guildId
                    }
                })

            if (!allEmbeds.length) {
                return interaction.reply({
                    content: "## No Twitch Streamer Found",
                    flags: MessageFlags.Ephemeral
                });
            }

            const embedsList = allEmbeds.slice(currentIndex, currentIndex + pageSize);
            const embedMessages = embedsList.map((embed) => {
                return new EmbedBuilder()
                    .setColor("#2B2D31")
                    .setDescription(
                        [
                            `**Channelname**: \`${embed.TwitchChannelName}\``,
                            `**Channel**: <#${embed.ChannelId}>`,
                            `**UUID**: \`\`\`${embed.UUID}\`\`\``
                        ].join("\n")
                    );
            });

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("twitch-manage-select")
                .setPlaceholder("Select a Option to manage")
                .addOptions(
                    embedsList.map((embed) => ({
                        label: embed.TwitchChannelName,
                        description: `UUID: ${embed.UUID}`,
                        value: embed.UUID
                    })) as any
                );

            const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:arrowbackregular24:1301119279088799815>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`twitch-manage:${uuid}:${currentIndex - pageSize}`)
                    .setDisabled(currentIndex === 0),
                new ButtonBuilder()
                    .setEmoji("<:next:1287457822526935090>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`twitch-manage:${uuid}:${currentIndex + pageSize}`)
                    .setDisabled(currentIndex + pageSize >= allEmbeds.length)
            );

            const selectMenuRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    selectMenu
                );

            await interaction.update({
                embeds: embedMessages,
                components: [navigationRow, selectMenuRow]
            });
        } catch (error) {
            console.error("Error:", error);
            interaction.reply({
                content:
                    "## An error occurred while fetching the menus. Please try again later",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
