import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client, ContainerBuilder,
    EmbedBuilder,
    MessageFlags, TextDisplayBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import Parser from "rss-parser";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

const parser = new Parser();

export default {
    id: "youtube-manage-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const uuid of interaction.values) {
            const guildId = interaction.guild?.id;

            const data = await database.guildYoutubeNotifications.findFirst({
                where: {
                    GuildId: guildId,
                    UUID: uuid.split(":")[0]
                }
            });


            let videodata = await parser.parseURL(
                `https://www.youtube.com/feeds/videos.xml?channel_id=${data.YoutubeChannelId}`
            );
            let {author} = videodata.items[0];

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:add:1260157236043583519>")
                    .setLabel("Update Discord Channel")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("youtube-update-channelname:" + data.UUID),
                new ButtonBuilder()
                    .setEmoji("<:message:1322252985702551767>")
                    .setLabel("Change Message Template")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("youtube-update-messageid:" + data.UUID),
                new ButtonBuilder()
                    .setEmoji("<:trash:1259432932234367069>")
                    .setLabel("Delete Twitch Channel")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("youtube-remove:" + data.UUID)
            );
            await interaction.reply({
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(
                                    [
                                        `**Youtube Channel**: ${author} (${data.YoutubeChannelId})`,
                                        `**Channel**: <#${data.ChannelId}>`,
                                        `**UUID**: ${data.UUID}`
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
