import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ContainerBuilder,
    MessageFlags, TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "twitch-toggle",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client User is not defined");

        let twitchData = await database.guildFeatureToggles.findFirst({
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

        twitchData = await database.guildFeatureToggles.findFirst({
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
                            .setContent(`## ${await convertToEmojiToPng("check")} Twitch Notifications are now ${twitchData.TwitchEnabled ? "enabled" : "disabled"}!`)
                    )
            ]
        });
    }
};
