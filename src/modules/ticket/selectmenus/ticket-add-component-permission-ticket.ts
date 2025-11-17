import {ChannelType, Client, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-permission-ticket",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];


        await database.ticketPermissions.update(
            {
                where: {
                    UUID: uuid
                },
                data: {
                    TicketPermissions: {
                        set: interaction.values
                    }
                }
            }
        )

        await interaction.deferUpdate();
    }
};
