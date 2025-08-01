import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags,} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";

export default {
    id: "button-ticket-transscript",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("button-ticket-transskript-send-user")
                .setLabel("Log Transscript to Member")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("button-ticket-transskript-send")
                .setLabel("Log Transscript to Channel")
                .setStyle(ButtonStyle.Primary)
        );

        if (!client.user) throw new Error("Client user is not cached");
        interaction.reply({
            content: `## ${await convertToEmojiPng("info", client.user?.id)} Transskript Options`,
            components: [row],
            flags: MessageFlags.Ephemeral,
        });
    },
};
