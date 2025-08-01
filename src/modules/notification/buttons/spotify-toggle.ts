import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "spotify-toggle",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client User is not defined");

        const spotifyData = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        });

        if (!spotifyData) {
            await database.guildFeatureToggles.create({
                data: {
                    GuildId: interaction.guild?.id,
                    SpotifyEnabled: true
                }
            });
        }

        if (spotifyData?.SpotifyEnabled) {
            await database.guildFeatureToggles.update(
                {
                    where: {GuildId: interaction.guild?.id},
                    data: {SpotifyEnabled: false}
                }
            );
        } else {
            await database.guildFeatureToggles.update(
                {
                    where: {GuildId: interaction.guild?.id},
                    data: {SpotifyEnabled: true}
                }
            );
        }

        const enabled = spotifyData?.SpotifyEnabled == true ? true : false;

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("spotify-toggle")
                .setLabel("Enable Spotify Notifications")
                .setEmoji(
                    enabled == true
                        ? "<:toggleoff:1301864526848987196>"
                        : "<:toggleon:1301864515838672908>"
                )
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("spotify-add-channelname")
                .setLabel("Add a Spotify Channel")
                .setEmoji("<:add:1260157236043583519>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("spotify-manage")
                .setEmoji("<:setting:1260156922569687071>")
                .setLabel("Manage Spotify Channels")
                .setStyle(ButtonStyle.Secondary)
        );

        interaction.update({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Spotify Notifications are now ${enabled == true ? "enabled" : "disabled"}!`,
            components: [row]
        });
    }
};
