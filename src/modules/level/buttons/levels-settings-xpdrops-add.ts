import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, TextDisplayBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {randomUUID} from "crypto";

export default {
    id: "levels-settings-xpdrops-add",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = randomUUID()
        await database.xPDrops.create({
            data: {
                UUID: uuid,
                LevelSettings: {
                    connect: {
                        GuildId: interaction.guild.id
                    }
                }
            }
        })

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`Create a new XP Drop for the Module. (ID: ${uuid})`)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setLabel("XP Range")
                                .setEmoji("<:renamesolid24:1259433901554929675>")
                                .setCustomId("levels-settings-xpdrops-xprange:" + uuid)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setLabel("Time to Respawn")
                                .setEmoji("<:timer:1321939051921801308>")
                                .setCustomId("levels-settings-xpdrops-respawn:" + uuid)
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setLabel("Channels")
                                .setEmoji("<:addchannel:1324458759589728387>")
                                .setCustomId("levels-settings-xpdrops-channels:" + uuid)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setLabel("Claim Amount")
                                .setEmoji("<:subtitle:1321938231788568586>")
                                .setCustomId("levels-settings-xpdrops-amount:" + uuid)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setLabel("Expire Time")
                                .setEmoji("<:timer:1321939051921801308>")
                                .setCustomId("levels-settings-xpdrops-expire:" + uuid)
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
            ]
        })

    }
};
