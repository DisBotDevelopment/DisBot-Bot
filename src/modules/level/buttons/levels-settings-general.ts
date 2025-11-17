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
    id: "levels-settings-general",

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
                            .setContent("Default XP Settings for the Module.")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-settings-general-enabled")
                                .setEmoji("<:wandsparkles:1433176825764249651>")
                                .setLabel("Toggle Level Module")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-general-firstxp")
                                .setEmoji("<:edit:1259961121075626066>")
                                .setLabel("Required XP for first Level")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-general-formular")
                                .setEmoji("<:renamesolid24:1259433901554929675>")
                                .setLabel("Formular")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-general-exclude")
                                .setEmoji("<:open:1279051433957789802>")
                                .setLabel("Exclude Settings")
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
            ]
        })

    }
};
