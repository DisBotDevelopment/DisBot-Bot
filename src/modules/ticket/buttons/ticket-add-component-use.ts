import {
    ActionRowBuilder,
    ButtonInteraction,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-use",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]

        await interaction.showModal(
            new ModalBuilder().setCustomId("ticket-add-component-use-messageurl:" + uuid).setTitle("Use a Message from you Discord")
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                        new TextInputBuilder()
                            .setLabel("Message Url")
                            .setStyle(TextInputStyle.Paragraph)
                            .setCustomId("message")
                            .setRequired(true)
                    )
                )
        )
    }
};
