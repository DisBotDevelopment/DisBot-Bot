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
    id: "levels-settings-voice-range",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
            .setCustomId("levels-settings-voice-range-modal")
            .setTitle("Set XP Range")

        const minInput = new TextInputBuilder()
            .setCustomId("min")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number")

        const maxInput = new TextInputBuilder()
            .setCustomId("max")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Min XP per Message")
                    .setDescription("Minimal XP per Message")
                    .setTextInputComponent(minInput),
                new LabelBuilder()
                    .setLabel("Max XP per Message")
                    .setDescription("Maximal XP per Message")
                    .setTextInputComponent(maxInput)
            )

        await interaction.showModal(modal)

    }
};
