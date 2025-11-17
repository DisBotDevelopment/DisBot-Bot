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
    id: "levels-settings-streaks-add",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
            .setCustomId("levels-settings-streaks-add-modal")
            .setTitle("Add Streaks")

        const input = new TextInputBuilder()
            .setCustomId("day")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number of Streak Day")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Day")
                    .setDescription("Everyday the member gets a Streak, if your Streak Increase allow it.")
                    .setTextInputComponent(input)
            )

        await interaction.showModal(modal)

    }
};
