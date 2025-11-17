import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-xpdrops-channels",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];
        const modal = new ModalBuilder()
            .setCustomId("levels-settings-xpdrops-channels-modal:" + uuid)
            .setTitle("XP Drop")

        const input = new ChannelSelectMenuBuilder()
            .setCustomId("input")
            .setChannelTypes(ChannelType.GuildText)
            .setMinValues(1)
            .setMaxValues(interaction.guild.channels.cache.size >= 25 ? 25 : interaction.guild.channels.cache.size)
            .setPlaceholder("Select Channels")

        modal
            .setLabelComponents(
                new LabelBuilder()
                    .setLabel("Channels")
                    .setDescription("Channels where the drop spawn")
                    .setChannelSelectMenuComponent(input)
            )

        await interaction.showModal(modal)

    }
};
