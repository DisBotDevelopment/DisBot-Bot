import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-xpdrops-xprange",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];
        const modal = new ModalBuilder()
            .setCustomId("levels-settings-xpdrops-xprange-modal:" + uuid)
            .setTitle("XP Drop")

        const input = new TextInputBuilder()
            .setCustomId("input")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number")

        const input2 = new TextInputBuilder()
            .setCustomId("input2")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number")


        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("XP Range")
                    .setDescription("Start XP Amount")
                    .setTextInputComponent(input),
                new LabelBuilder()
                    .setLabel("XP Range")
                    .setDescription("End XP Amount")
                    .setTextInputComponent(input2)
            )

        await interaction.showModal(modal)

    }
};
