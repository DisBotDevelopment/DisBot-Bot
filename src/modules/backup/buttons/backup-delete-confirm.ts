import {ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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
            content: `## ${await convertToEmojiToPng("check")} Your backup with the UUID \`${id}\`  was successfully deleted!`,
            flags: MessageFlags.Ephemeral
        });

    }
};
