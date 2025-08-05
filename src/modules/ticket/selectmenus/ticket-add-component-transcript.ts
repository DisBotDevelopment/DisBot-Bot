import {Client, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-transcript",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const message = await interaction.channel?.messages.fetch(
            interaction.message.id
        );

        for (const value of interaction.values) {
            await database.ticketSetups.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                        CustomId: interaction.customId.split(":")[1]
                    },
                    data: {
                        TranscriptChannelId: value
                    }
                }
            );

            await interaction.deferUpdate();
        }
    }
};
