import {AutocompleteInteraction, ChatInputCommandInteraction, Events} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {initUsersToDatabase} from "../../../helper/databaseHelper.js";

export default {
    name: Events.InteractionCreate,

    async execute(
        interaction: AutocompleteInteraction | ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        // Handle Autocomplete Interactions
        if (interaction.isAutocomplete()) {
            const command = client.commands?.get(interaction.commandName);

            if (!command) return;
            await initUsersToDatabase(client, interaction.user)

            try {
                if (command.autocomplete) {
                    await command.autocomplete(interaction);
                } else {
                    console.error(
                        `Command ${interaction.commandName} does not have an autocomplete method.`
                    );
                }
            } catch (error) {
                console.error(
                    `Error handling autocomplete for command ${interaction.commandName}:`,
                    error
                );
            }
        }
    }
};
