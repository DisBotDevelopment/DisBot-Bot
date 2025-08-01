import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ContainerBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
    id: "backup-delete",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client User is not defined");

        return interaction.reply({
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`## ${await convertToEmojiPng("package", client.user?.id)} Confirm Backup Delete process`)
                ).addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`backup-delete-confirm:${interaction.customId.split(":")[1]}`)
                        .setLabel("Confirm")
                        .setEmoji("<:check:1320090167444377713>")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`backup-delete-cancel`)
                        .setEmoji("<:x_:1322169218682322955>")
                        .setLabel("Cancel")
                        .setStyle(ButtonStyle.Secondary)
                ))
            ], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
        });
    }
};
