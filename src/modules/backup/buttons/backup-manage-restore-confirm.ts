import { ButtonInteraction, Guild, MessageFlags } from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import backup from "../../../systems/backup/index.js";
import { ExtendedClient } from "../../../types/client.js";
import { database } from "../../../main/database.js";

export default {
    id: "backup-manage-restore-confirm",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1];
        if (!client.user) throw new Error("Client User is not defined");

        const backupData = await database.guildBackups.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (!backupData) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Backup not found`,
                flags: MessageFlags.Ephemeral
            });
        }

        backup.load(interaction.customId.split(":")[1] as string, interaction.guild as Guild).then(async (data: any) => {
        })
    }
};
