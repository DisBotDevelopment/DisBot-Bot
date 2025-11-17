import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, StringSelectMenuBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-channels-type",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const modal = new ModalBuilder()
            .setCustomId("levels-settings-channels-type-modal")
            .setTitle("Set Message Type")

        const input = new StringSelectMenuBuilder()
            .setCustomId("input")
            .setOptions(
                [
                    {
                        label: "Per Message",
                        description: "Member gets XP per each Message.",
                        emoji: "<:message:1322252985702551767>",
                        value: "message"
                    },
                    {
                        label: "Cooldown",
                        description: "Member gets XP only if the Cooldown is ended.",
                        emoji: "<:timer:1321939051921801308>",
                        value: "cooldown"
                    },
                ]
            )

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Message XP Type")
                    .setDescription("Select your types.\n(more will follow - Suggest more)")
                    .setStringSelectMenuComponent(input)
            )

        await interaction.showModal(modal)

    }
};
