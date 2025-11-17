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
    id: "levels-settings-streaks-remove",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
            .setCustomId("levels-settings-streaks-remove-modal")
            .setTitle("Remove Streak")

        const input = new TextInputBuilder()
            .setCustomId("input")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Day")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Day")
                    .setDescription("Day you want to remove")
                    .setTextInputComponent(input)
            )

        await interaction.showModal(modal)

    }
};
