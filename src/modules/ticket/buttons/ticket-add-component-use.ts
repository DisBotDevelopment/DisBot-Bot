import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ContainerBuilder, MessageFlags,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-use",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]

        await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [
                new ContainerBuilder()
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setLabel("Use Button for Component")
                                .setEmoji("<:emoji:1327305176553492520>")
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId("ticket-add-component-use-button:" + uuid),
                            new ButtonBuilder()
                                .setLabel("Use Selectmenu for Component")
                                .setEmoji("<:emoji:1327304700701315132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId("ticket-add-component-use-select:" + uuid),
                            new ButtonBuilder()
                                .setLabel("Components V2")
                                .setEmoji("<:puzzle:1381000302601441440>")
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId("ticket-add-component-use-components:" + uuid)
                        )
                    )

            ]
        })
    }
};
