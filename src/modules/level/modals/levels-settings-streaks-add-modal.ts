import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, ModalSubmitInteraction, RoleSelectMenuBuilder, StringSelectMenuBuilder, TextDisplayBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {NUM} from "undici/lib/llhttp/constants.js";
import ms, {StringValue} from "ms";

export default {
    id: "levels-settings-streaks-add-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        try {
            const day = Number(interaction.fields.getTextInputValue("day"));

            const data = await database.xPStreaks.findFirst({
                where: {
                    GuildId: interaction.guild.id,
                    Days: day
                }
            })

            if (!data) {
                await database.xPStreaks.create({
                    data: {
                        LevelSettings: {
                            connect: {
                                GuildId: interaction.guild.id
                            },
                        },
                        Days: day
                    }
                })
            }

            await interaction.reply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`Customize your Streak Day: ${day}`)
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setLabel("Change Nickname")
                                    .setEmoji("<:renamesolid24:1259433901554929675>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId("levels-settings-streaks-add-nickname:" + day),
                                new ButtonBuilder()
                                    .setLabel("Level Options") // Level, XP, Multiplier
                                    .setEmoji("<:wandsparkles:1433176825764249651>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId("levels-settings-streaks-add-level-options:" + day),
                                new ButtonBuilder()
                                    .setLabel("Message Template")
                                    .setEmoji("<:message:1322252985702551767>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId("levels-settings-streaks-add-message:" + day),
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                                new RoleSelectMenuBuilder()
                                    .setMinValues(0)
                                    .setMaxValues(interaction.guild.roles.cache.size)
                                    .setCustomId("levels-settings-streaks-add-reward-roles:" + day)
                            )
                        )
                ]
            })


        } catch (e) {
            await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This is not a valid input!`, interaction, true, "reply")
        }

    }
};
