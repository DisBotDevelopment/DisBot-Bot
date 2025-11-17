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
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-modal-show",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]


        const data = await database.ticketSetups.findFirst({
            include: {
                ModalOptions: true
            },
            where: {
                CustomId: uuid,
                HasModal: true
            }
        })

        if (!data) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("error")} There is no Modal Data!`
            })
        }

        const modal = new ModalBuilder().setCustomId("ticket-add-component-modal-show-modal:" + uuid).setTitle(data.ModalTitle)
        for (let i = 0; i < 5; i++) {
            const option = data.ModalOptions[i];
            if (!option) continue;

            const input = new TextInputBuilder()
                .setCustomId(i.toString())
                .setLabel(option.Name)
                .setStyle(option.Type)
                .setRequired(option.Required);

            if (option.Placeholder) input.setPlaceholder(option.Placeholder);
            if (typeof option.MinLength === 'number') input.setMinLength(option.MinLength);
            if (typeof option.MaxLength === 'number') input.setMaxLength(option.MaxLength);

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(input)
            );

            await interaction.showModal(modal)
        }
    }
};
 