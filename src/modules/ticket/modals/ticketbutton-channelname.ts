import {ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticketbutton-channelname",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const openMessage = interaction.fields.getTextInputValue("message");

        const message = await interaction.channel?.messages.fetch(
            interaction.message?.id as string
        );

        const content = message?.content.split("|");

        if (!content) {
            console.error("Message content is undefined");
            return;
        }

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: content[2] as string
                },
                data: {
                    TicketChannelName: openMessage
                }
            }
        );

        interaction.deferUpdate();
    }
};
