import {ButtonStyle, ChannelType, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-button-modal-title",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const name = interaction.fields.getTextInputValue(
            "ticket-menu-modal-title-name"
        );
        const messagid = interaction.fields.getTextInputValue(
            "ticket-menu-modal-title-messageid"
        );
        const uuid = interaction.fields.getTextInputValue(
            "ticket-menu-modal-title-uuid"
        );

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: uuid
                },
                data: {
                    ModalTitle: name,
                    HasModal: true,
                }
            }
        );

        interaction.deferUpdate();
    }
};
