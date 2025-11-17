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
    id: "levels-settings-streaks",

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
                            .setContent("Setup XP Streaks for the Level Module.")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("levels-settings-streaks-message-type")
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
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("levels-settings-streaks-increase-type")
                                .setPlaceholder("(REQUIRED) More types can trigger it, but only once.")
                                .setMinValues(1)
                                .setMaxValues(3)
                                .setRequired(true)
                                .addOptions(
                                    [
                                        // If suggested: add amount of level to get a streak, amount message(...) and minutes in Voice.
                                        // Later Modal and you select on option and you can add data...
                                        {
                                            label: "Level Up",
                                            description: "Member gets a Level Up",
                                            emoji: "<:wandsparkles:1433176825764249651>",
                                            value: "level"
                                        },
                                        {
                                            label: "Member sends a Message",
                                            description: "Send a Message in a Chat.",
                                            emoji: "<:text:1199381324117594182>",
                                            value: "message"
                                        },
                                        {
                                            label: "Joins a Voice Channel",
                                            description: "Join a Voice channel on the Day.",
                                            emoji: "<:voice:1199381325694632067>",
                                            value: "voice"
                                        },
                                    ]
                                )
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-settings-streaks-add")
                                .setEmoji("<:add:1260157236043583519>")
                                .setLabel("Add Streaks")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("levels-settings-streaks-remove")
                                .setEmoji("<:trash:1259432932234367069>")
                                .setLabel("Remove Streaks by Day")
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
            ]
        })

    }
};
