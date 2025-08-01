import axios from "axios";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "spotify-manage",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const guildId = interaction.guild?.id;
        const pageSize = 5;

        try {
            const allEmbeds = await database.spotifyNotifications
                .findMany({
                    where: {
                        GuildId: guildId
                    }
                })

            const conf = await database.disBot.findFirst({
                where: {
                    GetConf: "config"
                }
            })

            if (!allEmbeds.length) {
                if (!client.user) throw new Error("Client User is not defined");
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} No Button Found`,
                    flags: MessageFlags.Ephemeral
                });
            }

            const embedsList = allEmbeds.slice(currentIndex, currentIndex + pageSize);
            const embedMessages = await Promise.all(
                embedsList.map(async (embed) => {
                    const req = await axios.get(
                        `https://api.spotify.com/v1/shows/${embed.ShowId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${conf?.SpotifyToken}`
                            }
                        }
                    );

                    return new EmbedBuilder()
                        .setColor("#2B2D31")
                        .setDescription(
                            [
                                `**Show**: ***${req.data.name}*** (\`${embed.ShowId}\`)`,
                                `**Channel**: <#${embed.ChannelId}>`,
                                `**Role**: <@&${embed.PingRoles[0]}>`,
                                `**UUID**: \`\`\`${embed.UUID}\`\`\``
                            ].join("\n")
                        );
                })
            );


            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("spotify-manage-select")
                .setPlaceholder("Select a Option to manage")
                .addOptions(
                    embedsList.map((embed) => ({
                        label: `${embed.ShowId}`,
                        description: `UUID: ${embed.UUID}`,
                        value: embed.UUID,
                        emoji: "<:spotify:1365769492734676994>"
                    })) as any
                );

            const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:arrowbackregular24:1301119279088799815>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`spotify-manage:${uuid}:${currentIndex - pageSize}`)
                    .setDisabled(currentIndex === 0),
                new ButtonBuilder()
                    .setEmoji("<:next:1287457822526935090>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`spotify-manage:${uuid}:${currentIndex + pageSize}`)
                    .setDisabled(currentIndex + pageSize >= allEmbeds.length)
            );

            const selectMenuRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    selectMenu
                );

            await interaction.update({
                embeds: embedMessages as any,
                components: [navigationRow, selectMenuRow]
            });
        } catch (error) {
            console.error("Error:", error);
            interaction.reply({
                content:
                    "## An error occurred while fetching the buttons. Please try again later",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
