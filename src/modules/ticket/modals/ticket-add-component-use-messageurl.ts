import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    ModalSubmitInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-use-messageurl",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const message = interaction.fields.getTextInputValue(
            "message"
        ).split("/")
        const uuid = interaction.customId.split(":")[1];

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
                                .setCustomId("ticket-add-component-use-button:" + uuid + ":" + message[6] + ":" + message[5]),
                            new ButtonBuilder()
                                .setLabel("Use Selectmenu for Component")
                                .setEmoji("<:emoji:1327304700701315132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId("ticket-add-component-use-select:" + uuid + ":" + message[6] + ":" + message[5])
                        )
                    )

            ]
        })

    }
};
