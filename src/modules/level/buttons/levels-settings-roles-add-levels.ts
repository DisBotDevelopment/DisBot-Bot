import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, RoleSelectMenuBuilder, TextDisplayBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-roles-add-levels",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
            .setCustomId("levels-settings-roles-add-levels-modal:" + interaction.customId.split(":")[1])
            .setTitle("Level Options")

        const level = new TextInputBuilder()
            .setCustomId("level")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Number")
        
        const multiplier = new TextInputBuilder()
            .setCustomId("multiplier")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Double")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Level")
                    .setDescription("Level to assign role")
                    .setTextInputComponent(level),
                new LabelBuilder()
                    .setLabel("Multiplier")
                    .setDescription("Number to multiple (*) the xp.")
                    .setTextInputComponent(multiplier),
            )

        await interaction.showModal(modal)

    }
};
