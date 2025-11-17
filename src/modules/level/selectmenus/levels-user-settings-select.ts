import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType,
    Client, ContainerBuilder,
    GuildMemberRoleManager, LabelBuilder,
    MessageFlags, ModalBuilder,
    StringSelectMenuBuilder, StringSelectMenuInteraction, TextDisplayBuilder, TextInputBuilder, TextInputStyle,
    UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-user-settings-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1]

        switch (interaction.values[0]) {
            case "level-reset": {
                await database.levels.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            Level: 0,
                        }
                    }
                )
                await interaction.deferUpdate()
            }
                break
            case "xp-reset": {
                await database.levels.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            XP: "0"
                        }
                    }
                )
                await interaction.deferUpdate()
            }
                break;
            case "reset-level-data": {

                await interaction.update({
                    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addActionRowComponents(
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Confirm")
                                        .setEmoji("<:check:1275172002436481065>")
                                        .setCustomId("levels-users-settings-confirm:reset-level-data:" + interaction.customId.split(":")[1])
                                        .setStyle(ButtonStyle.Secondary)
                                )
                            )
                    ]
                })

            }
                break;
            case "delete": {
                await interaction.update({
                    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addActionRowComponents(
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Confirm")
                                        .setEmoji("<:check:1275172002436481065>")
                                        .setCustomId("levels-users-settings-confirm:delete:" + interaction.customId.split(":")[1])
                                        .setStyle(ButtonStyle.Secondary)
                                )
                            )
                    ]
                })
            }
                break;
            default: {
                const modal = new ModalBuilder()
                    .setCustomId("levels-user-settings-select-modal:" + interaction.values[0] + ":" + interaction.customId.split(":")[1])
                    .setTitle("Level User Settings")

                const input = new TextInputBuilder()
                    .setCustomId("input")
                    .setStyle(TextInputStyle.Short)

                modal.addLabelComponents(
                    new LabelBuilder()
                        .setLabel("Input")
                        .setDescription("Please fill in the type for your selection!")
                        .setTextInputComponent(input)
                )

                await interaction.showModal(modal)
            }
        }
    },
};
