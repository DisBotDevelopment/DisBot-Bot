import {ButtonStyle, EmbedBuilder, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-preview",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const data = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.customId.split(":")[1]
            }
        });

        if (data?.EmbedJSON) {
            interaction.reply({
                content: data.Content ? data.Content : "-# No Content",
                embeds: [new EmbedBuilder(JSON.parse(data.EmbedJSON))],
                flags: MessageFlags.Ephemeral
            });
        } else {
            interaction.reply({
                content: data?.Content ? data.Content : "-# No Content",
                embeds: [new EmbedBuilder().setDescription("-# No Embed")],
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
