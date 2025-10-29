import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ContainerBuilder,
    EmbedBuilder,
    MessageFlags, TextDisplayBuilder,
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
        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [

                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("shield")} Security Gate Verification`,
                                    ``,
                                    `Welcome to the Security Gate Verification Management!`,
                                    `Here you can manage the verification gates for your server.`,
                                    `You can create, edit, or delete verification gates.`,
                                    `To create a new verification gate, click the button below.`,
                                    ``,
                                ].join("\n")
                            )
                    )
                    .addActionRowComponents(
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
                        ))
            ]
        })
    }
};
