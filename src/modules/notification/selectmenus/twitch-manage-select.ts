import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    MessageFlags,
    UserSelectMenuInteraction
} from "discord.js";
import {database} from "../../../main/database.js";

export default {
    id: "twitch-manage-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: Client) {
        for (const uuid of interaction.values) {
            const guildId = interaction.guild?.id;

            const nextEmbed = await database.twitchNotifications.findFirst(
                {
                    where: {
                        GuildId: guildId,
                        UUID: uuid.split(":")[0]
                    }
                });
            if (!nextEmbed) {
                interaction.reply({
                    content: "## No Twitch Streamer Found",
                    flags: MessageFlags.Ephemeral
                });
            }

            const embedMessage = new EmbedBuilder()
                .setColor("#2B2D31")
                .setDescription(
                    [
                        `**Channelname**: \`${nextEmbed.TwitchChannelName}\``,
                        `**Channel**: <#${nextEmbed.ChannelId}>`,
                        `**UUID**: \`\`\`${nextEmbed.UUID}\`\`\``
                    ].join("\n")
                );

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:edit:1259961121075626066>")
                    .setLabel("Edit Channel Name")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("twitch-update-channelname:" + nextEmbed.UUID),
                new ButtonBuilder()
                    .setEmoji("<:message:1322252985702551767>")
                    .setLabel("Edit Message ID")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("youtube-update-messageid:" + nextEmbed.UUID),
                new ButtonBuilder()
                    .setEmoji("<:trash:1259432932234367069>")
                    .setLabel("Delete " + nextEmbed.TwitchChannelName)
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("twitch-remove:" + nextEmbed.UUID)
            );
            await interaction.reply({
                embeds: [embedMessage],
                components: [row],
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
