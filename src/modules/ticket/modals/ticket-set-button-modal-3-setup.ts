import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-set-button-modal-3-setup",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client is not defined");

        const name = interaction.fields.getTextInputValue(
            "ticket-menu-modal-option-setup-name"
        );

        const placehoder = interaction.fields.getTextInputValue(
            "ticket-menu-modal-option-setup-placeholder"
        );
        const types = interaction.fields.getTextInputValue(
            "ticket-menu-modal-option-setup-type"
        );

        let type = 0;
        if (types == "Short") type = 1;
        else if (types == "Paragraph") type = 2;
        else {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} Please select a valid type`,
                flags: MessageFlags.Ephemeral
            });
        }

        const uuid = interaction.fields.getTextInputValue(
            "ticket-menu-modal-option-setup-uuid"
        );
        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: uuid
            }
        });
        
        interaction.deferUpdate();
    }
};
