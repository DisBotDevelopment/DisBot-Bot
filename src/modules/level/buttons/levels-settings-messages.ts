import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder,
    MessageFlags,
    ModalBuilder, StringSelectMenuBuilder, TextDisplayBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-messages",

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
                            .setContent("Change Channels and Messages from the Module.")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("levels-settings-messages-type")
                                .addOptions(
                                    [
                                        {
                                            label: "DM Message",
                                            description: "DisBot send a DM Message",
                                            emoji: "<:user:1259432940383768647>",
                                            value: "user"
                                        },
                                        {
                                            label: "Same Channel",
                                            description: "Level Up Message in the same channel",
                                            emoji: "<:text:1395716083452874826>",
                                            value: "channel"
                                        },
                                        {
                                            label: "Custom Channel",
                                            description: "Select a custom Channel",
                                            emoji: "<:addchannel:1324458759589728387>",
                                            value: "custom"
                                        },
                                    ]
                                )
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-settings-messages-template")
                                .setEmoji("<:message:1322252985702551767>")
                                .setLabel("Level Up Message Template")
                                .setStyle(ButtonStyle.Secondary),
                        ),
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-settings-messages-user")
                                .setEmoji("<:message:1322252985702551767>")
                                .setLabel("User Rank Message Template")
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
            ]
        })

    }
};
