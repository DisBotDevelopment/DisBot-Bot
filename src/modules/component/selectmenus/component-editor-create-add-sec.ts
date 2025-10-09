import "dotenv/config";
import {
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {isInDevelopment} from "../../../helper/utilityHelper.js";

export default {
    id: "component-editor-create-add-sec",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        // INDEV
        await isInDevelopment(client, interaction)

        for (const value of interaction.values) {
            switch (value) {

            }
        }
    }
};
