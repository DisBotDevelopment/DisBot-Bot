import "dotenv/config";
import {
    ComponentType, ContainerComponent,
    MessageFlags, ModalSubmitInteraction,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {isInDevelopment} from "../../../helper/utilityHelper.js";

export default {
    id: "component-editor-delete-modal",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    execute: async function (
        interaction: ModalSubmitInteraction,
        client: ExtendedClient
    ) {
        const messageId = interaction.customId.split(":")[1]
        const message = await interaction.channel.messages.fetch(messageId)

        const ids = interaction.fields.getTextInputValue("id").split(",")

        let newComponents = [];

        if (ids.length === 1) {
            newComponents = message.components.filter((_, i) => i !== Number(ids[0]));
        } else if (ids.length === 2) {
            newComponents = JSON.parse(JSON.stringify(message.components));

            if (newComponents[Number(ids[0])]?.components) {
                newComponents[Number(ids[0])].components = newComponents[Number(ids[0])].components.filter(
                    (_, i) => i !== Number(ids[1])
                );
            }
        } else if (ids.length === 3) {
            newComponents = JSON.parse(JSON.stringify(message.components));

            if (newComponents[Number(ids[0])]?.components?.[Number(ids[1])]?.components) {
                newComponents[Number(ids[0])].components[Number(ids[1])].components =
                    newComponents[Number(ids[0])].components[Number(ids[1])].components.filter(
                        (_, i) => i !== Number(ids[2])
                    );
            }
        }

        await message.edit({
            flags: MessageFlags.IsComponentsV2,
            components: newComponents
        })

        await interaction.deferUpdate()
    }
};
