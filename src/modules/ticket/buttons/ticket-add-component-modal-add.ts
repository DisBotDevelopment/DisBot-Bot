import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ContainerBuilder,
    MessageFlags, ModalBuilder, RoleSelectMenuBuilder, SeparatorBuilder, SeparatorComponent, SeparatorSpacingSize,
    StringSelectMenuBuilder,
    TextDisplayBuilder, TextInputBuilder, TextInputStyle,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-modal-add",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]

        const allModals = await database.ticketSetups.findFirst({
            include: {
                ModalOptions: true
            },
            where: {
                CustomId: uuid
            }
        })
        if (allModals.ModalOptions.length >= 5) {
            return await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} You only can have 5 modal options.`
            })
        }

        const modal = new ModalBuilder()
        const label = new TextInputBuilder()
        const placeholder = new TextInputBuilder()
        const required = new TextInputBuilder()
        const minmaxLength = new TextInputBuilder()
        const type = new TextInputBuilder()

        modal
            .setCustomId("ticket-add-component-modal-add-modal:" + uuid)
            .setTitle("Add Modal Option")

        label
            .setStyle(TextInputStyle.Short)
            .setCustomId("label")
            .setRequired(true)
            .setPlaceholder("Name of the Option")
            .setLabel("Name of the Option")

        placeholder
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Nice placeholder text here")
            .setCustomId("placeholder")
            .setRequired(false)
            .setLabel("Placeholder of the Option")

        required
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("true or false")
            .setCustomId("required")
            .setRequired(false)
            .setLabel("Require input in Option")
            .setMinLength(4)
            .setMaxLength(4)

        minmaxLength
            .setStyle(TextInputStyle.Short)
            .setCustomId("minmaxlength")
            .setPlaceholder("Number of the max and min Length. E.g.: 4(min),5(max)")
            .setLabel("Set Min Max Length")
            .setRequired(false)

        type
            .setStyle(TextInputStyle.Short)
            .setCustomId("type")
            .setPlaceholder("Text Input Style can be Short = 1 or Paragraph = 2")
            .setLabel("Set Min Max Length")
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(1)

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(label),
            new ActionRowBuilder<TextInputBuilder>().addComponents(placeholder),
            new ActionRowBuilder<TextInputBuilder>().addComponents(required),
            new ActionRowBuilder<TextInputBuilder>().addComponents(minmaxLength),
            new ActionRowBuilder<TextInputBuilder>().addComponents(type)
        )

        await interaction.showModal(modal)

    }
};
 