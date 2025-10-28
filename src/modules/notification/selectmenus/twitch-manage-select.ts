import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client, ContainerBuilder,
    EmbedBuilder,
    MessageFlags, TextDisplayBuilder,
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

            const data = await database.guildTwitchNotifications.findFirst(
                {
                    where: {
                        GuildId: guildId,
                        UUID: uuid.split(":")[0]
                    }
                });

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:add:1260157236043583519>")
                    .setLabel("Update Discord Channel")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("twitch-update-channelname:" + data.UUID),
                new ButtonBuilder()
                    .setEmoji("<:message:1322252985702551767>")
                    .setLabel("Change Message Template")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("twitch-update-messageid:" + data.UUID),
                new ButtonBuilder()
                    .setEmoji("<:trash:1259432932234367069>")
                    .setLabel("Delete Twitch Channel")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("twitch-remove:" + data.UUID)
            );
            await interaction.reply({
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(
                                    [
                                        `**Twitch Channel Name**: \`${data.TwitchChannelName}\``,
                                        `**Channel**: ${data.ChannelId ? `<#${data.ChannelId}>` : "N/A"}>`,
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
