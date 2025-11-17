import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ChannelType,
    ContainerBuilder,
    MessageFlags, StringSelectMenuBuilder,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ticketSettings} from "../../../helper/ticketHelper.js";
import {uuid} from "short-uuid";

export default {
    id: "ticket-add-component-settings",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const customId = interaction.customId.split(":")[1];

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent("Manage your Ticket Settings for this Component.")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("ticket-add-component-settings-select:" + customId)
                                .setMinValues(1)
                                .setMaxValues(1)
                                .setPlaceholder("Select settings for the Component")
                                .addOptions(ticketSettings)
                        )
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("-# Select to delete or add a setting.")
                    )
            ]
        })

    },
};
