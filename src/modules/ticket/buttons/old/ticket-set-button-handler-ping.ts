import {ButtonInteraction, ButtonStyle, ComponentType,} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    id: "ticket-set-button-handler-ping",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: interaction.customId.split(":")[1]
            }
        });

    }
};
