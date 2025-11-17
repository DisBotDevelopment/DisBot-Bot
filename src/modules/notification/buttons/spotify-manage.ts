import axios from "axios";
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
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {PaginationData} from "../../../types/Pagination.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";

export default {
    id: "spotify-manage",

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

        try {
            const data = await database.guildSpotifyNotifications
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

            if (!data.length) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No Twitch Streamer Found`, interaction, true)
            }


            const list = data.slice(currentIndex, currentIndex + pageSize);

            const embedMessages = new TextDisplayBuilder()
                .setContent((await Promise.all(list.map(async (l) => {

                    const req = await axios.get(
                        `https://api.spotify.com/v1/shows/${l.ShowId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${conf?.SpotifyToken}`
                            }
                        }
                    );
                    return [
                        `**Show**: ***${req.data.name}*** (${l.ShowId})`,
                        `**Channel**: <#${l.ChannelId}>`,
                        `**UUID**: ${l.UUID}`
                    ].join("\n")

                }))).join("\n\n"));


            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("spotify-manage-select")
                .setPlaceholder("Select a Option to manage")
                .addOptions(await Promise.all(list.map(async (l) => {

                    const req = await axios.get(
                        `https://api.spotify.com/v1/shows/${l.ShowId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${conf?.SpotifyToken}`
                            }
                        }
                    );

                    return ({
                        label: `${req.data.name} (${l.ShowId})`,
                        description: `UUID: ${l.UUID}`,
                        value: l.UUID,
                        emoji: "<:spotify:1365769492734676994>"
                    })
                })));

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
