import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ContainerBuilder,
    MessageFlags, TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
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

        let spotifyData = await database.guildFeatureToggles.findFirst({
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


        spotifyData = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        });

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("check")} Spotify Notifications are now ${spotifyData.SpotifyEnabled ? "enabled" : "disabled"}!`)
                    )
            ]
        });
    }
};
