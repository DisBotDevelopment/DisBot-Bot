import {ChannelType, Client, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-auto-old-category",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        for (const value of interaction.values) {

            await database.ticketSetups.update(
                {
                    where: {
                        CustomId: interaction.customId.split(":")[1]
                    },
                    data: {
                        OldTicketCategoryId: value
                    }
                }
            );

            await interaction.deferUpdate();
        }
    }
}
;
