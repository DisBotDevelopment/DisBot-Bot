import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-set-button-messages-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.fields.getTextInputValue(
            "ticket-set-button-messages-uuid"
        );

        const menuID = interaction.customId.split(":")[1];

        const message = await database.messageTemplates.findFirst({
            where: {
                Name: uuid
            }
        });

        if (!message) {
            return interaction.reply({
                content: "## No Message found with this UUID",
                flags: MessageFlags.Ephemeral
            });
        }

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: menuID
                },
                data: {
                    MessageTempleateId: uuid
                }
            }
        );

        interaction.deferUpdate();
    }
};
