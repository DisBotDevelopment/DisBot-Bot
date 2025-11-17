import {ButtonStyle, ChannelType, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-modal-title-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const title = interaction.fields.getTextInputValue(
            "title"
        );
        const uuid = interaction.customId.split(":")[1]

        await database.ticketSetups.update(
            {
                where: {
                    CustomId: uuid
                },
                data: {
                    ModalTitle: title,
                }
            }
        );

        await interaction.deferUpdate();
    }
};
