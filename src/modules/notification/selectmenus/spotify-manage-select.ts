import axios from "axios";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    MessageFlags,
    TextInputStyle,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "spotify-manage-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        interaction.values.forEach(async (uuid) => {

            const data = await database.spotifyNotifications.findFirst({where: {UUID: uuid}});

            if (!data) {
                if (!client.user) throw new Error("Client User is not defined");
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} Spotify Show Not Found`,
                    flags: MessageFlags.Ephemeral
                });
            }

            const conf = await database.disBot.findFirst({
                where: {
                    GetConf: "config"
                }
            })

            const req = await axios.get(
                `https://api.spotify.com/v1/shows/${data.ShowId}`,
                {
                    headers: {
                        Authorization: `Bearer ${conf?.SpotifyToken}`
                    }
                }
            );

            if (!client.user) throw new Error("Client user not found");
            const embed = new EmbedBuilder()
                .setDescription(
                    [
                        `## ${await convertToEmojiPng("spotify", client.user.id)} Spotify`,
                        ``,
                        `**Show Name**: ${req.data?.name} (\`${data.ShowId}\`)`,
                        `**Channel**: <#${data.ChannelId}>`,
                        `**Role**: <@&${data.PingRoles[0]}>`,
                        `**Show URL**: [Spotify Link](https://open.spotify.com/show/${data.ShowId})`,
                        `**UUID**: \`${data?.UUID}\``
                    ].join("\n")
                )
                .setColor("#2B2D31");

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`spotify-delete:${data.UUID}`)
                    .setLabel("Delete Show")
                    .setEmoji("<:trash:1259432932234367069>")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`spotify-message:${data.UUID}`)
                    .setLabel("Edit Message Template")
                    .setEmoji("<:message:1322252985702551767>")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`spotify-channel:${data.UUID}`)
                    .setLabel("Edit Channel")
                    .setEmoji("<:edit:1259961121075626066>")
                    .setStyle(ButtonStyle.Secondary),
            );


            await interaction.update({
                embeds: [embed],
                components: [row]
            });

        })
    }
};
