import "dotenv/config";
import {
    LabelBuilder,
    MessageFlags, ModalBuilder,
    StringSelectMenuInteraction, TextDisplayBuilder, TextDisplayComponent, TextInputBuilder, TextInputStyle,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "component-editor-create-add-sec",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const messageId = interaction.customId.split(":")[1]


        try {
            const modal = new ModalBuilder().setCustomId("component-editor-position:" + messageId + ":" + interaction.values[0]).setTitle("Component Editor")
            const id = new TextInputBuilder().setStyle(TextInputStyle.Short).setCustomId("id").setPlaceholder("Any Number they is not used.")
            const position = new TextInputBuilder().setStyle(TextInputStyle.Short).setCustomId("position").setPlaceholder("0,0,0 Are the Position you can use!")
            modal.setLabelComponents(
                new LabelBuilder()
                    .setLabel("ID")
                    .setDescription("Set the Position ID of the Component use View IDs")
                    .setTextInputComponent(id),
                new LabelBuilder()
                    .setLabel("Position")
                    .setDescription("Set the Position of the Component use View IDs")
                    .setTextInputComponent(position)
            )
            await interaction.showModal(modal)
        } catch (e) {
            console.log(e)
        }

    }
};
