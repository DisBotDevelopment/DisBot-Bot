import {UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-set-button-blacklistrole-sec",

    /**
     * @param {UserSelectMenuInteraction} interaction
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const message = await interaction.channel?.messages.fetch(
            interaction.message.id
        );

        for (const value of interaction.values) {
            const role = interaction.guild?.roles.cache.get(value);

            const content = message?.content.split("|");
            if (!content) throw new Error("No content found.");

            await database.ticketSetups.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                        CustomId: content[2]
                    },
                    data: {
                        TicketBlacklistRoles: {
                            set: [role?.id]
                        }
                    }
                }
            );

            interaction.deferUpdate();
        }
    }
};
