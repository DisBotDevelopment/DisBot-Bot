import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder,
    MessageFlags,
    ModalBuilder, TextDisplayBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiGif, convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-view-all",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const data = await database.levelSettings.findFirst({
            include: {
                XPDrops: true,
                LevelRoles: true,
                XPStreaks: true
            },
            where: {
                GuildId: interaction.guild.id
            }
        })

        const message = {
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent([
                            `## ${await convertToEmojiToPng("wandsparkles")} View Settings`,
                            `### ${await convertToEmojiToPng("text")} Message XP Settings`,
                            `-# **XP Range**: ${data.MessageXPRange ?? "Not set"}`,
                            `-# **XP Cooldown**: ${data.MessageXPCooldown ?? "Not set"}`,
                            `-# **Message Type**: ${data.MessageXPType?.join(", ") || "None"}`,
                            `-# **Enabled**: ${data.IsMessageXPEnabled ? "Yes" : "No"}`,
                            `### ${await convertToEmojiToPng("voice")} Voice XP Settings`,
                            `-# **XP Range**: ${data.VoiceXPRange ?? "Not set"}`,
                            `-# **XP Cooldown**: ${data.VoiceXPCooldown ?? "Not set"}`,
                            `-# **Enabled**: ${data.IsVoiceXPEnabled ? "Yes" : "No"}`,
                            `### ${await convertToEmojiToPng("message")} Message Templates`,
                            `-# **LevelUp Message Template**: ${data.LevelUpMessageTemplateId ?? "Not set"}`,
                            `-# **LevelUp Message Type**: ${data.LevelUpMessageType ?? "Not set"}`,
                            `-# **User Rank Message Template**: ${data.LevelUserInfoMessageTemplate ?? "Not set"}`,
                            `### ${await convertToEmojiToPng("wandsparkles")} Leveling Settings`,
                            `-# **Required XP First Level**: ${data.RequiredXPForFirstLevel ?? "Not set"}`,
                            `-# **Formula**: ${data.RequiredXPFormular ?? "Default"}`,
                            `-# **Level Up Message Type**: ${data.LevelUpMessageType ?? "Not set"}`,
                            `-# **Level Up Message Channel**: ${data.LevelUpMessageType == "custom" ? (data.LevelUpChannelId ? `<#${data.LevelUpChannelId}>` : "None") : "Not used"}`,
                            `### ${await convertToEmojiToPng("chartarea")} Leaderboard`,
                            `-# **Template ID**: ${data.LeaderboardMessageTemplateId ?? "None"}`,
                            `-# **Display Amount**: ${data.LeaderboardDisplayAmount ?? "Not set"}`,
                            `### ${await convertToEmojiToPng("folder")} Exclusions`,
                            `-# **Excluded Channels**: ${data.ExcludedChannelIds.map((c) => `<#${c}>`)?.join(", ") || "None"}`,
                            `-# **Excluded Users**: ${data.ExcludeUserIds.map((c) => `<@${c}>`)?.join(", ") || "None"}`,
                            `-# **Excluded Roles**: ${data.ExcludeRoleIds.map((c) => `<@&${c}>`)?.join(", ") || "None"}`,

                        ].join("\n"))
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-view-roles")
                                .setLabel("View Roles")
                                .setEmoji("<:role:1335667919119585480>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-view-streaks")
                                .setLabel("View Streaks")
                                .setEmoji("<:flame:1433571082614603856>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-view-drops")
                                .setLabel("View Drops")
                                .setEmoji("<:package:1365715766623604746>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
            ]
        }

        if (interaction.customId.includes("back")) {
            await interaction.update({...message, flags: MessageFlags.IsComponentsV2,})
        } else {
            await interaction.reply({...message, flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral})
        }
    }
};
