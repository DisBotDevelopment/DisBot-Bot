import { ActionRowBuilder, ButtonInteraction, MessageFlags, ModalBuilder, TextInputBuilder } from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/client.js";
import { database } from "../../../main/database.js";

export default {
    id: "backup-create",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");
        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} You must be the owner of the server to create a backup.`, flags: MessageFlags.Ephemeral
            });
        }

        const userBackupCount = await database.users.findFirst({
            where: {
                UserId: interaction.user.id
            }
        });

        const backups = await database.guildBackups
            .findMany({
                where: {
                    UserId: interaction.user.id
                }
            })

        if ((userBackupCount?.BackupCount as number) <= backups.length) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} You have reached the maximum backup limit. Please delete some backups to create new ones.`,
                flags: MessageFlags.Ephemeral
            });
        }


        const model = new ModalBuilder()
        const name = new TextInputBuilder()
        const maxMessagesPerChannel = new TextInputBuilder()
        const doNotBackup = new TextInputBuilder()
        const backupMembers = new TextInputBuilder()



        model.setCustomId("backup-create-modal")
            .setTitle("Setup Backup Options")

        name
            .setCustomId("name")
            .setLabel("Backup Name")
            .setPlaceholder("Type in your name or the guild name will used.")
            .setStyle(1)

        maxMessagesPerChannel.setCustomId("maxMessagesPerChannel")
            .setLabel("Max Messages Per Channel")
            .setStyle(1)
            .setPlaceholder("Enter the max messages per channel")
            .setRequired(true)
            .setMinLength(0)
            .setMaxLength(1000)

        doNotBackup.setCustomId("doNotBackup")
            .setLabel("Do Not Backup")
            .setStyle(1)
            .setPlaceholder("channels, emojis, roles, bans | seperated by commas")
            .setRequired(false)
            .setMinLength(0)
            .setMaxLength(1000)

        backupMembers.setCustomId("backupMembers")
            .setLabel("Backup Members")
            .setStyle(1)
            .setPlaceholder("true or false")
            .setRequired(true)
            .setMinLength(0)
            .setMaxLength(1000)

        model.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                name,
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                maxMessagesPerChannel,
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                doNotBackup,
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                backupMembers,
            ),
        )

        await interaction.showModal(model)
    }
};
