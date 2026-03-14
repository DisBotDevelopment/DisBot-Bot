import {
    AttachmentBuilder,
    ButtonInteraction,
    ContainerBuilder,
    FileBuilder,
    MessageFlags,
    TextDisplayBuilder
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import type {BackupData} from "../../../systems/backup/types/BackupData.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "backup-download",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const id = interaction.customId.split(":")[1];

        const data = await database.guildBackups.findFirst({where: {UUID: id}});

        if (!data) {
            if (!client.user) throw new Error("Client User is not defined");
            return interaction.editReply({
                content: `## ${await convertToEmojiToPng("error")} No Backup Found`,
            });
        }

        if (!client.user) throw new Error("Client User is not defined");

        const jsonBackupData = (JSON.parse(data.BackupJSON as string) as BackupData)
        const buffer = Buffer.from(JSON.stringify(jsonBackupData, null, 4), "utf-8");
        const fileName = `${data.UUID}.json`;
        const file = Buffer.from(buffer);

        await interaction.reply({
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`## ${await convertToEmojiToPng("package")} Share and Download your Backup\n-# ⚠️ Please keep in mind that you store sensitive data in this backup. Make sure to keep it safe and not share it with anyone you don't trust.`)
                ).addFileComponents(
                    new FileBuilder().setURL(`attachment://${fileName}`)
                )
            ],
            files: [
                new AttachmentBuilder(file).setName(fileName),
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });
    }
};
