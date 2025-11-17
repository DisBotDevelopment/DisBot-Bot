import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder,
    MessageFlags,
    ModalBuilder, TextDisplayBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-leaderboard",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent("Level Leaderboard Settings")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-settings-leaderboard-amount")
                                .setEmoji("<:renamesolid24:1259433901554929675>")
                                .setLabel("Display Amount per Page")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-leaderboard-message")
                                .setEmoji("<:message:1322252985702551767>")
                                .setLabel("Leaderboard Message Template")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
            ]
        })

    }
};
