import {EmbedBuilder, TextChannel, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-send-sec",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];

        const data = await database.messageTemplates.findFirst({
            where: {
                Name: uuid
            }
        });

        for (const value of interaction.values) {
            const channel = interaction.guild?.channels.cache.get(value);
            if (data?.EmbedJSON) {
                (channel as TextChannel).send({
                    content: data?.Content ? data.Content : " ",
                    embeds: [new EmbedBuilder(JSON.parse(data.EmbedJSON))]
                });
            } else {
                (channel as TextChannel).send({
                    content: data?.Content ? data.Content : ""
                });
            }

            interaction.deferUpdate();
        }
    }
};
