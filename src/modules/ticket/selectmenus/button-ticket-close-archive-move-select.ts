import {Client, MessageFlags, TextChannel, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "button-ticket-close-archive-move-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {
            const channel = interaction.channel;
            if (!interaction.channel) throw new Error("No Channel found.");
            const category = interaction.guild?.channels.cache.get(value);

            await (channel as TextChannel).setParent(category?.id as string);
        }

        await interaction.reply({
            content: "## Ticket moved to the selected category",
            flags: MessageFlags.Ephemeral
        });
    }
};
