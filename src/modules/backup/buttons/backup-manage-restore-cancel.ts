import {ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import { convertToEmojiToPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/ExtendedClient.js";

export default {
  id: "backup-manage-restore-cancel",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client User is not defined");

        return interaction.update({
            content: `## ${await convertToEmojiToPng("package")} Backup restore process has been cancelled`,
            components: []
        });
    }
};
