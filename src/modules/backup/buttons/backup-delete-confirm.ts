import {ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "backup-delete-confirm",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const id = interaction.customId.split(":")[1];

        await database.guildBackups.delete({
            where: {
                UUID: id
            }
        });

        if (!client.user) throw new Error("Client User is not defined");
        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Your backup with the UUID \`${id}\`  was successfully deleted!`,
            flags: MessageFlags.Ephemeral
        });

    }
};
