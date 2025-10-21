import {
    ActionRowBuilder,
    ButtonInteraction,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-manage-component-delete",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        await interaction.deferReply({flags: MessageFlags.Ephemeral,})
        const uuid = interaction.customId.split(":")[1];
        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: uuid
            }
        })

        if (!data) {
            return await interaction.editReply({
                content: `## ${await convertToEmojiToPng("error")} There are no Component Data found`,
            })
        }

        await database.ticketModalData.deleteMany(
            {
                where: {
                    TicketSetupId: uuid
                }
            }
        )
        await database.ticketPermissions.deleteMany(
            {
                where: {
                    TicketSetupId: uuid
                }
            }
        )
        await database.ticketSetups.deleteMany({
            where: {
                CustomId: uuid
            }
        })

        await interaction.editReply({
            content: `## ${await convertToEmojiToPng("check")} Ticket Component was deleted successfully!`,
        })
    }
};
