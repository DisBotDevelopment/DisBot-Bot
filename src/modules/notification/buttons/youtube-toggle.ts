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
    id: "youtube-toggle",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client User is not defined");

        let youtubeData = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        });
        if (!youtubeData) {
            await database.guildFeatureToggles.create({
                data: {
                    GuildId: interaction.guild?.id,
                    YoutubeEnabled: true
                }
            });

        }

        if (youtubeData?.YoutubeEnabled) {
            await database.guildFeatureToggles.update(
                {
                    where: {GuildId: interaction.guild?.id},
                    data: {YoutubeEnabled: false}
                }
            );
        } else {
            await database.guildFeatureToggles.update(
                {
                    where: {GuildId: interaction.guild?.id},
                    data: {YoutubeEnabled: true}
                }
            );
        }

        youtubeData = await database.guildFeatureToggles.findFirst({
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
                            .setContent(`## ${await convertToEmojiToPng("check")} Youtube Notifications are now ${youtubeData.YoutubeEnabled ? "enabled" : "disabled"}!`)
                    )
            ]
        });
    }
};
