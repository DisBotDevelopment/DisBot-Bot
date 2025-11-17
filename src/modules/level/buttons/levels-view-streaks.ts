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
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-view-streaks",

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

        await interaction.update({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent([
                            `### ${await convertToEmojiToPng("flame")} XP Streaks`,
                            `-# **Channel Id**: ${data.XPStreaksMessageType == "custom" ? (data.XPStreaksMessageChannelId ? `<#${data.XPStreaksMessageChannelId}>` : "Not set") : "Not used"}`,
                            `-# **Message Type**: ${data.XPStreaksMessageType ?? "Not set"}`,
                            `-# **Increase Type**: ${data.XPStreaksIncreaseType?.join(", ") || "None"}`,
                            `${data.XPStreaks?.length
                                ? data.XPStreaks.map(s =>
                                    `-# **Day**: ${s.Days ?? "Not set"}
↳ **Nickname**: ${s.Nickname ?? "Not set"}
↳ **Bonus Levels**: ${s.BonusLevels ?? "0"}
↳ **Bonus XP**: ${s.BonusXP ?? "0"}
↳ **Multiplier**: ${s.Multiplier ?? "1x"}
↳ **Template ID**: ${s.MessageTemplateId ?? "None"}
↳ **Role Rewards**: ${s.RoleRewardIds?.length ? s.RoleRewardIds.map(id => `<@&${id}>`).join(", ") : "None"}`
                                ).join("\n\n")
                                : "-# None"
                            }`,
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
                                .setCustomId("levels-view-drops")
                                .setLabel("View Drops")
                                .setEmoji("<:package:1365715766623604746>")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-view-all:back")
                                .setEmoji("<:arrowbackregular24:1301119279088799815>")
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
            ]
        })

    }
};
