import {ButtonStyle, ChannelType, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-button-modal-option-setup",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const name = interaction.fields.getTextInputValue(
            "ticket-menu-modal-option-setup-name"
        );

        const placehoder = interaction.fields.getTextInputValue(
            "ticket-menu-modal-option-setup-placeholder"
        );
        const types = interaction.fields.getTextInputValue(
            "ticket-menu-modal-option-setup-type"
        );

        if (!client.user) throw new Error("Client user is not cached");

        let type = 0;
        if (types == "Short") type = 1;
        else if (types == "Paragraph") type = 2;
        else {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
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
    }
}