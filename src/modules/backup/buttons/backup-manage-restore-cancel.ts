import {ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/client.js";

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
            content: `## ${await convertToEmojiPng("package", client.user?.id)} Backup restore process has been cancelled`,
            components: []
        });
    }
};
