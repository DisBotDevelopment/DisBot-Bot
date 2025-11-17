import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType, ComponentType, ContainerBuilder,
    EmbedBuilder, LabelBuilder,
    MessageFlags, ModalBuilder,
    ModalSubmitInteraction, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {updateComponentsWithPositions} from "../../../helper/messageHelper.js";
import {URL_PLACEHOLDER} from "../../../main/placeholder.js";

export default {
    id: "component-editor-create-button-modal",

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

        const customid = interaction.fields.getTextInputValue("customid");
        const label = interaction.fields.getTextInputValue("label");
        const emoji = interaction.fields.getTextInputValue("emoji");
        const style = Number(interaction.fields.getStringSelectValues("style")[0]);

        const button = new ButtonBuilder()
            .setStyle(style)

        if (style == ButtonStyle.Link) {

            let url = customid;
            for (const [key, value] of Object.entries(URL_PLACEHOLDER)) {
                if (url.includes(key)) {
                    url = url.replace(key, value);
                }
            }

            button.setURL(url)
        } else button.setCustomId(customid);
        if (label) button.setLabel(label);
        if (emoji) button.setEmoji(emoji);

        let newComponents = [];
        newComponents = JSON.parse(JSON.stringify(message.components));

        const actionRow = new ActionRowBuilder().addComponents(
            button
        )

        if (positions.length == 1 && newComponents[Number(positions[0])]?.type == ComponentType.ActionRow) {
            newComponents[Number(positions[0])].components.forEach((c) => {
                actionRow.addComponents(new ButtonBuilder(c))
            })
        } else if (positions.length == 2 && newComponents[Number(positions[0])]?.components[Number(positions[1])]?.type == ComponentType.ActionRow) {
            newComponents[Number(positions[0])].components[Number(positions[1])].components.forEach((c) => {
                actionRow.addComponents(new ButtonBuilder(c))
            })
        }

        await updateComponentsWithPositions(
            message,
            actionRow.toJSON(),
            positions,
        )

        await interaction.deferUpdate()
    }
}