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
    id: "levels-settings-streaks-add-level-options",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
            .setCustomId("levels-settings-streaks-add-level-options-modal:" + interaction.customId.split(":")[1])
            .setTitle("Level Options")

        const level = new TextInputBuilder()
            .setCustomId("level")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number")

        const xp = new TextInputBuilder()
            .setCustomId("xp")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number")

        const multiplier = new TextInputBuilder()
            .setCustomId("multiplier")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Extra Level")
                    .setDescription("Give the user an extra Level for the Streak.")
                    .setTextInputComponent(level),
                new LabelBuilder()
                    .setLabel("Extra XP")
                    .setDescription("Give the user extra XP for the Streak.")
                    .setTextInputComponent(xp),
                new LabelBuilder()
                    .setLabel("Multiplier")
                    .setDescription("Apply a Multiplier to the User. Multiplier (*)")
                    .setTextInputComponent(multiplier)
            )

        await interaction.showModal(modal)

    }
};
