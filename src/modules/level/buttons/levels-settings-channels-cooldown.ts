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
    id: "levels-settings-channels-cooldown",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
            .setCustomId("levels-settings-channels-cooldown-modal")
            .setTitle("Set Message Cooldown")

        const input = new TextInputBuilder()
            .setCustomId("input")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number - 1m, 1h, 1d")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("XP Cooldown")
                    .setDescription("Cooldown for Messages they get XP")
                    .setTextInputComponent(input)
            )

        await interaction.showModal(modal)

    }
};
