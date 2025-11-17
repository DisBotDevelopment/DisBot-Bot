import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    id: "commands-manager-description",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client User is not defined");


        const modal = new ModalBuilder()
        const input = new TextInputBuilder()

        modal
            .setTitle("Edit Description")
            .setCustomId("commands-manager-description-modal:"+ interaction.customId.split(":")[1])

        input
            .setCustomId("input")
            .setLabel("Description")
            .setMaxLength(25)
            .setMinLength(1)
            .setStyle(TextInputStyle.Short)

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                input
            )
        )

        await interaction.showModal(modal)

    }
};
