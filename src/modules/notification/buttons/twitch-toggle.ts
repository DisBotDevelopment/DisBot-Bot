import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "twitch-toggle",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client User is not defined");

        const twitchData = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        });

        if (!twitchData) {
            await database.guildFeatureToggles.create({
                data: {
                    GuildId: interaction.guild?.id,
                    TwitchEnabled: true
                }
            });
        }

        if (twitchData?.TwitchEnabled) {
            await database.guildFeatureToggles.update(
                {
                    where: {GuildId: interaction.guild?.id},
                    data: {TwitchEnabled: false}
                }
            );
        } else {
            await database.guildFeatureToggles.update(
                {
                    where: {GuildId: interaction.guild?.id},
                    data: {TwitchEnabled: true}
                }
            );
        }

        const enabled = twitchData?.TwitchEnabled == true ? true : false;

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("twitch-toggle")
                .setLabel("Enable Twitch Notifications")
                .setEmoji(
                    enabled == true
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

        interaction.update({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Twitch Notifications are now ${enabled == true ? "enabled" : "disabled"
            }!`,
            components: [row]
        });
    }
};
