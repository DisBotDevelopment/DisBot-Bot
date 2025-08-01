import {Client, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-set-button-transsript-sec",

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
            const channel = interaction.guild?.channels.cache.get(value);

            const content = message?.content.split("|");
            if (!content) throw new Error("Channel not found");

            await database.ticketSetups.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                        CustomId: content[2]
                    },
                    data: {
                        TranscriptChannelId: channel?.id
                    }
                }
            );

            await interaction.deferUpdate();
        }
    }
};
