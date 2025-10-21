import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import ms, {StringValue} from "ms";

export default {
    id: "ticket-add-component-ticket-creation-cooldown-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.fields.getTextInputValue(
            "time"
        );

        const menuID = interaction.customId.split(":")[1];

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: menuID
                },
                data: {
                    TicketCreationCooldownPerUser: uuid ? Number(uuid) : null
                }
            }
        );

        await interaction.deferUpdate();
    }
};
