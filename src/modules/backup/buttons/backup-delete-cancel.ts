import { ButtonInteraction, ButtonStyle, MessageFlags } from "discord.js";
import { convertToEmojiToPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
    id: "backup-delete-cancel",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client User is not defined");

        return interaction.update({
            content: `## ${await convertToEmojiToPng("package")} Backup delete process has been cancelled`,
            components: []
        });
    }
};
