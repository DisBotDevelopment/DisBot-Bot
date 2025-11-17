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
    id: "levels-view-roles",

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
                            `### ${await convertToEmojiToPng("role")} Level Roles`,
                            `${data.LevelRoles?.length
                                ? data.LevelRoles.map(r =>
                                    `-# **Role**: <@&${r.RoleId}>  
               ↳ **Level**: ${r.Level ?? "Not set"}  
               ↳ **Multiplier**: ${r.Multiplier ?? "1x"}  
               ↳ **Types**: ${r.Types?.join(", ") || "None"}`
                                ).join("\n")
                                : "-# None"
                            }`,
                        ].join("\n"))
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-view-streaks")
                                .setLabel("View Streaks")
                                .setEmoji("<:flame:1433571082614603856>")
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
