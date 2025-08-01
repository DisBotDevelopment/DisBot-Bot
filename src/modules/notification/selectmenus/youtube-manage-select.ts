import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    MessageFlags,
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

            const nextEmbed = await database.youtubeNotifications.findFirst({
                where: {
                    GuildId: guildId,
                    UUID: uuid.split(":")[0]
                }
            });
            if (!nextEmbed) {
                interaction.reply({
                    content: "## No YouTube Channel Found",
                    flags: MessageFlags.Ephemeral
                });
            }

            let videodata = await parser.parseURL(
                `https://www.youtube.com/feeds/videos.xml?channel_id=${nextEmbed.YoutubeChannelId}`
            );
            let {author} = videodata.items[0];

            const embedMessage = new EmbedBuilder()
                .setColor("#2B2D31")
                .setDescription(
                    [
                        `**Channelname**: \`${author}\``,
                        `**Channel**: <#${nextEmbed.ChannelId}>`,
                        `**UUID**: \`\`\`${nextEmbed.UUID}\`\`\``
                    ].join("\n")
                );

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:edit:1259961121075626066>")
                    .setLabel("Edit Channel Name")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("youtube-update-channelname:" + nextEmbed.UUID),
                new ButtonBuilder()
                    .setEmoji("<:message:1322252985702551767>")
                    .setLabel("Edit Message ID")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("youtube-update-messageid:" + nextEmbed.UUID),
                new ButtonBuilder()
                    .setEmoji("<:trash:1259432932234367069>")
                    .setLabel("Delete " + author)
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("youtube-remove:" + nextEmbed.UUID)
            );
            await interaction.reply({
                embeds: [embedMessage],
                components: [row],
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
