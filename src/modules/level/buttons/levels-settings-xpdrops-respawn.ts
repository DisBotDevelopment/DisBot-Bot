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
    id: "levels-settings-xpdrops-respawn",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];
        const modal = new ModalBuilder()
            .setCustomId("levels-settings-xpdrops-respawn-modal:" + uuid)
            .setTitle("XP Drop")

        const input = new TextInputBuilder()
            .setCustomId("input")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Time - 12h, 10d")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Respawn TIme")
                    .setDescription("Respawn time for the Drop.")
                    .setTextInputComponent(input)
            )

        await interaction.showModal(modal)

    }
};
