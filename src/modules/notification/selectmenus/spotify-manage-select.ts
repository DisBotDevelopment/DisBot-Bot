import axios from "axios";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client, ContainerBuilder,
    EmbedBuilder,
    MessageFlags, TextDisplayBuilder,
    TextInputStyle,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
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
        for (const uuid of interaction.values) {

            const data = await database.guildSpotifyNotifications.findFirst({where: {UUID: uuid}});

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

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`spotify-delete:${data.UUID}`)
                    .setEmoji("<:trash:1259432932234367069>")
                    .setLabel("Delete Twitch Channel")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`spotify-message:${data.UUID}`)
                    .setEmoji("<:message:1322252985702551767>")
                    .setLabel("Change Message Template")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`spotify-channel:${data.UUID}`)
                    .setEmoji("<:add:1260157236043583519>")
                    .setLabel("Update Discord Channel")
                    .setStyle(ButtonStyle.Secondary),
            );


            await interaction.reply({
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(
                                    [
                                        `**Show Name**: ${req.data?.name} (\`${data.ShowId}\`)`,
                                        `**Channel**: <#${data.ChannelId}>`,
                                        `**UUID**: \`${data?.UUID}\``
                                    ].join("\n")
                                )
                        )
                        .addActionRowComponents(row)
                ],
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
            });

        }
    }
};
