import {ChannelType, Client, UserSelectMenuInteraction,} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-set-button-category-sec",

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
            if (!content) throw new Error("Content is not defined");

            const data = await database.ticketSetups.findFirst({
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: content[2],
                }
            });

            if (!client.user?.id) throw new Error("Client user ID is not defined");


            await database.ticketSetups.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                        CustomId: content[2],
                    },
                    data: {
                        CategoryId: channel?.id,
                    }
                }
            );

            interaction.deferUpdate();
        }
    },
};
