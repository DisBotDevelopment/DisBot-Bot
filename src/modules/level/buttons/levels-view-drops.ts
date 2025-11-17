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
    id: "levels-view-drops",

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
                            `### ${await convertToEmojiToPng("package")} XP Drops`,
                            `-# **Message Template**: ${data.XPDropsMessageTemplate ?? "Not set"}`,
                            `${data.XPDrops?.length
                                ? data.XPDrops.map(r =>
                                    `-# **UUID**: ${r.UUID}  
               ↳ **Last Spawned**: ${r.LastSpawned ? `<t:${Math.floor(new Date(r.LastSpawned).getTime() / 1000)}:R>` : "Not set"}  
               ↳ **Time to Respawn**: ${r.TimeToRespawn ?? "Not set"} 
               ↳ **Expire Time**: ${r.ExpireTime ?? "Not set"} 
               ↳ **Claim Amount**: ${r.ClaimAmount}
               ↳ **XP Range**: ${r.XPRange}
               ↳ **Spawn Channels**: ${r.ChannelIds.map((c) => `<#${c}>`).join(", ")}`
                                ).join("\n")
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
                                .setCustomId("levels-view-streaks")
                                .setLabel("View Streaks")
                                .setEmoji("<:flame:1433571082614603856>")
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
