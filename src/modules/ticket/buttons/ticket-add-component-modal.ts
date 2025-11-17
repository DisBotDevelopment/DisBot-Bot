import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ContainerBuilder,
    MessageFlags,
    ModalBuilder, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-modal",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1];

        interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("Add custom form to your ticket component")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-modal-add:" + uuid)
                                .setEmoji("<:emoji:1260157236043583519>")
                                .setLabel("Add Modal Option")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-modal-title:" + uuid)
                                .setEmoji("<:emoji:1259433901554929675>")
                                .setLabel("Modal Title")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-modal-reset:" + uuid)
                                .setEmoji("<:emoji:1259432932234367069>")
                                .setLabel("Reset Modal")
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-modal-enable:" + uuid)
                                .setEmoji("<:emoji:1301864515838672908>")
                                .setLabel("Enable Modal")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("Write \"\`DELETE\`\" in the Modal Option to remove the option from the modal!")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-modal-show:" + uuid)
                                .setEmoji("<:emoji:1260156922569687071>")
                                .setLabel("Show your modal")
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
            ]
        })

    }
};
