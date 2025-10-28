import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    Client, ContainerBuilder, EmbedBuilder, MessageFlags, TextDisplayBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "notification-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: Client) {
        for (const value of interaction.values) {

            switch (value) {
                case "twitch": {
                    await interaction.deferReply({
                        flags: MessageFlags.Ephemeral
                    });


                    const data = await database.guildFeatureToggles.findFirst({
                        where: {
                            GuildId: interaction.guild.id
                        }
                    });
                    if (!client.user) throw new Error("Client user not found");

                    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("twitch-toggle")
                            .setLabel(`${data?.TwitchEnabled ? "Disable" : "Enable"} Twitch Notifications`)
                            .setEmoji(
                                data?.TwitchEnabled
                                    ? "<:toggleoff:1301864526848987196>"
                                    : "<:toggleon:1301864515838672908>"
                            )
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("twitch-add-channelname")
                            .setLabel("Add a Twitch Channel")
                            .setEmoji("<:add:1260157236043583519>")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("twitch-manage")
                            .setEmoji("<:setting:1260156922569687071>")
                            .setLabel("Manage Twitch Channels")
                            .setStyle(ButtonStyle.Secondary)
                    );

                    await interaction.editReply({
                        flags: MessageFlags.IsComponentsV2,
                        components: [
                            new ContainerBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder()
                                        .setContent(
                                            [
                                                `## ${await convertToEmojiToPng("twitch")} Twitch`,
                                                ``,
                                                `- **Toggled**: ${data?.TwitchEnabled ? `${await convertToEmojiToPng("toggleon")} (On)` : `${await convertToEmojiToPng("toggleoff")} (Off)`}`,
                                                ``,
                                                `**Enable Twitch Notifications** - Toggle Twitch Notifications`,
                                                `**Add a Twitch Channel** - Add a Twitch Channel to the System`,
                                                `**Manage Twitch Channels** - Manage the Twitch Channels`
                                            ].join("\n")
                                        )
                                )
                                .addActionRowComponents(row)
                        ]
                    });
                }
                    break;
                case "youtube": {
                    await interaction.deferReply({
                        flags: MessageFlags.Ephemeral
                    });
                    const data = await database.guildFeatureToggles.findFirst({
                        where: {
                            GuildId: interaction.guild.id
                        }
                    });
                    if (!client.user) throw new Error("Client user not found");
                    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("youtube-toggle")
                            .setLabel(`${data?.TwitchEnabled ? "Disable" : "Enable"} YouTube Notifications`)
                            .setEmoji(
                                data?.YoutubeEnabled
                                    ? "<:toggleoff:1301864526848987196>"
                                    : "<:toggleon:1301864515838672908>"
                            )
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("youtube-add-channelid")
                            .setLabel("Add a YouTube Channel")
                            .setEmoji("<:add:1260157236043583519>")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("youtube-manage")
                            .setEmoji("<:setting:1260156922569687071>")
                            .setLabel("Manage YouTube Channels")
                            .setStyle(ButtonStyle.Secondary)
                    );

                    await interaction.editReply({
                        flags: MessageFlags.IsComponentsV2,
                        components: [
                            new ContainerBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder()
                                        .setContent(
                                            [
                                                `## ${await convertToEmojiToPng("youtube")} YouTube`,
                                                ``,
                                                `- **Toggled**: ${data?.YoutubeEnabled ? `${await convertToEmojiToPng("toggleon")} (On)` : `${await convertToEmojiToPng("toggleoff")} (Off)`}`,
                                                ``,
                                                `**Enable YouTube Notifications** - Toggle YouTube Notifications`,
                                                `**Add a YouTube Channel** - Add a YouTube Channel to the System`,
                                                `**Manage YouTube Channels** - Manage the YouTube Channels`
                                            ].join("\n")
                                        )
                                )
                                .addActionRowComponents(row)
                        ]
                    });
                }
                    break;
                case "spotify": {
                    await interaction.deferReply({
                        flags: MessageFlags.Ephemeral
                    });

                    const data = await database.guildFeatureToggles.findFirst({
                        where: {
                            GuildId: interaction.guild.id
                        }
                    });
                    if (!client.user) throw new Error("Client user not found");
                    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("spotify-toggle")
                            .setLabel(`${data?.TwitchEnabled ? "Disable" : "Enable"} Spotify Notifications`)
                            .setEmoji(
                                data?.SpotifyEnabled
                                    ? "<:toggleoff:1301864526848987196>"
                                    : "<:toggleon:1301864515838672908>"
                            )
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("spotify-add-channelname")
                            .setLabel("Add a Spotify Show Channel")
                            .setEmoji("<:add:1260157236043583519>")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("spotify-manage")
                            .setEmoji("<:setting:1260156922569687071>")
                            .setLabel("Manage spotify Channels")
                            .setStyle(ButtonStyle.Secondary)
                    );

                    await interaction.editReply({
                        flags: MessageFlags.IsComponentsV2,
                        components: [
                            new ContainerBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder()
                                        .setContent(
                                            [
                                                `## ${await convertToEmojiToPng("spotify")} Spotify`,
                                                ``,
                                                `- **Toggled**: ${data?.SpotifyEnabled ? `${await convertToEmojiToPng("toggleon")} (On)` : `${await convertToEmojiToPng("toggleoff")} (Off)`}`,
                                                ``,
                                                `**Enable Spotify Notifications** - Toggle Spotify Notifications`,
                                                `**Add a Spotify Channel** - Add a Spotify Channels to the System`,
                                                `**Manage Spotify Channels** - Manage the Spotify Channels`
                                            ].join("\n")
                                        )
                                )
                                .addActionRowComponents(row)
                        ]
                    });
                }
                    break
                case "tiktok": {

                }
                    break
            }

        }
    }
};
