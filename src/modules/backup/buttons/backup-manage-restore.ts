import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags, TextDisplayBuilder
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "backup-manage-restore",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client User is not defined");
        if (interaction.user.id !== interaction.guild?.ownerId) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Only the server owner can use this command.`,
                flags: MessageFlags.Ephemeral
            });
        }


        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`## ${await convertToEmojiPng("package", client.user?.id)} Confirm your backup restore process \n\n-# ⚠️ **Warning**: This will override all your current server settings and data`)
                ).addActionRowComponents(
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`backup-manage-restore-confirm:${interaction.customId.split(":")[1]}`)
                            .setLabel("Confirm")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:check:1320090167444377713>"),
                        new ButtonBuilder()
                            .setCustomId(`backup-manage-restore-cancel`)
                            .setLabel("Cancel")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:x_:1322169218682322955>"),
                    )
                )
            ]
        });


    }
};
