import {
    ActionRowBuilder, ButtonComponent,
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

export default {
    id: "levels-settings-general-formular",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        try {
            const modal = new ModalBuilder()
                .setCustomId("levels-settings-general-formular-modal")
                .setTitle("Required XP Formular")

            const input = new TextInputBuilder()
                .setCustomId("input")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("{xp}*2.5")

            modal
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent("A not valid input will fail later.")
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel("Formular")
                        .setDescription("Placeholders: {level} - Current Level, {xp} - Old required XP")
                        .setTextInputComponent(input)
                )

            await interaction.showModal(modal)
        } catch (e) {
            console.log(e)
        }
    }
};
