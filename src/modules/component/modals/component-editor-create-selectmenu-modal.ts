import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder, LabelBuilder, MentionableSelectMenuBuilder,
    MessageFlags, ModalBuilder,
    ModalSubmitInteraction, RoleSelectMenuBuilder, SeparatorBuilder, SeparatorSpacingSize,
    StringSelectMenuBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {showComponentFollowModal, updateComponentsWithPositions} from "../../../helper/messageHelper.js";
import {Channel} from "diagnostics_channel";

export default {
    id: "component-editor-create-selectmenu-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const messageId = interaction.customId.split(":")[1]
        const message = await interaction.channel.messages.fetch(messageId)
        const positions = interaction.customId.split(":")[2].split(",")
        const id = interaction.customId.split(":")[3]

        const customId = interaction.fields.getTextInputValue("customid");
        const type = interaction.fields.getStringSelectValues("type")[0];
        const placeholder = interaction.fields.getTextInputValue("placeholder");
        const limit = interaction.fields.getTextInputValue("limit").split(",")
        const data = interaction.fields.getTextInputValue("data")


        const actionRowBuilder = new ActionRowBuilder()

        switch (type) {
            case "user": {
                actionRowBuilder.addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId(customId)
                        .setMaxValues(Number(limit[0]))
                        .setMinValues(Number(limit[1]))
                        .setPlaceholder(placeholder)
                )
            }
                break
            case "channel": {
                actionRowBuilder.addComponents(
                    new ChannelSelectMenuBuilder()
                        .setCustomId(customId)
                        .setMaxValues(Number(limit[0]))
                        .setMinValues(Number(limit[1]))
                        .setPlaceholder(placeholder)
                        .setChannelTypes(
                            data.split(",").map((c) => ChannelType[c])
                        )
                )
            }
                break
            case "role": {
                actionRowBuilder.addComponents(
                    new RoleSelectMenuBuilder()
                        .setCustomId(customId)
                        .setMaxValues(Number(limit[0]))
                        .setMinValues(Number(limit[1]))
                        .setPlaceholder(placeholder)
                )
            }
                break
            case "mention": {
                actionRowBuilder.addComponents(
                    new MentionableSelectMenuBuilder()
                        .setCustomId(customId)
                        .setMaxValues(Number(limit[0]))
                        .setMinValues(Number(limit[1]))
                        .setPlaceholder(placeholder)
                )
            }
                break
            case "string": {

                const options = data.split("\n").map((o) => {
                    const optionsData = o.substring(2).split(";")
                    return {
                        label: optionsData[1],
                        description: optionsData[2],
                        emoji: optionsData[3],
                        value: optionsData[0],
                    }
                })
                actionRowBuilder.addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(customId)
                        .setMaxValues(Number(limit[0]))
                        .setMinValues(Number(limit[1]))
                        .setPlaceholder(placeholder)
                        .addOptions(
                            options
                        )
                )
            }
                break
        }

        await updateComponentsWithPositions(
            message,
            actionRowBuilder.toJSON(),
            positions,
        )

        await interaction.deferUpdate()
    }
}