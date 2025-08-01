import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    TextInputStyle
} from "discord.js";

export default {
    id: "security-gate-verification",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");
        interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [
                new EmbedBuilder()
                    .setDescription([
                        `## ${await convertToEmojiPng("shield", client.user?.id)} Security Gate Verification`,
                        ``,
                        `Welcome to the Security Gate Verification Management!`,
                        `Here you can manage the verification gates for your server.`,
                        `You can create, edit, or delete verification gates.`,
                        `To create a new verification gate, click the button below.`,
                        ``,
                    ].join("\n"))
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("security-gate-verification-create")
                        .setLabel("Create Verification Gate")
                        .setEmoji("<:add:1260157236043583519>")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("security-gate-verification-manage")
                        .setLabel("Manage Verification Gates")
                        .setEmoji("<:setting:1260156922569687071>")
                        .setStyle(ButtonStyle.Secondary)
                )
            ]
        })
    }
};
