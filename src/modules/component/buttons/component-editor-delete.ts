import "dotenv/config";
import {
    LabelBuilder,
    MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {isInDevelopment} from "../../../helper/utilityHelper.js";

export default {
    id: "component-editor-delete",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        await interaction
            .showModal(
                new ModalBuilder()
                    .setTitle("Delete Component with ID")
                    .setCustomId("component-editor-delete-modal:" + interaction.customId.split(":")[1])
                    .setLabelComponents(
                        new LabelBuilder()
                            .setLabel("Component ID")
                            .setDescription("To view the Ids use the Button View Components Ids")
                            .setTextInputComponent(
                                new TextInputBuilder()
                                    .setStyle(TextInputStyle.Short)
                                    .setMinLength(1)
                                    .setCustomId("id")
                            )
                    )
            )
    }
};
