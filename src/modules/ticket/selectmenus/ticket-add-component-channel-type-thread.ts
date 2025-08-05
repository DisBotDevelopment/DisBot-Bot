import {ChannelType, Client, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-channel-type-thread",

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
                        GuildId: interaction.guild?.id,
                        CustomId: interaction.customId.split(":")[1]
                    },
                    data: {
                        CategoryId: value,
                        ChannelType: ChannelType.PrivateThread
                    }
                }
            );

            await interaction.deferUpdate();
        }
    }
};
