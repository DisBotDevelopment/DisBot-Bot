import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-general-firstxp",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        try {
            const modal = new ModalBuilder()
                .setCustomId("levels-settings-general-firstxp-modal")
                .setTitle("Required XP")

            const input = new TextInputBuilder()
                .setCustomId("input")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Number")

            modal
                .setLabelComponents(
                    new LabelBuilder()
                        .setLabel("Required XP")
                        .setDescription("Set the first Required XP")
                        .setTextInputComponent(input)
                )

            await interaction.showModal(modal)
        } catch (e) {
            console.log(e)
        }
    }
};
