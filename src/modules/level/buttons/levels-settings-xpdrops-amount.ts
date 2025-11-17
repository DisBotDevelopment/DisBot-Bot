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
    id: "levels-settings-xpdrops-amount",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];
        const modal = new ModalBuilder()
            .setCustomId("levels-settings-xpdrops-amount-modal:" + uuid)
            .setTitle("XP Drop")

        const input = new TextInputBuilder()
            .setCustomId("input")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Claim Amount")
                    .setDescription("How many users can claim it.")
                    .setTextInputComponent(input)
            )

        await interaction.showModal(modal)

    }
};
