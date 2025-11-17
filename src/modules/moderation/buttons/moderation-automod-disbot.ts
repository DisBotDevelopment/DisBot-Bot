import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle,} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {isInDevelopment} from "../../../helper/utilityHelper.js";

export default {
    id: "moderation-automod-disbot",
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        // INDEV
        await isInDevelopment(client, interaction)

        // Select your GuildDisBotAutoModeration!

    },
};
