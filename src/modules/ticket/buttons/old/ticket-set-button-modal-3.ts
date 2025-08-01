import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {database} from "../../../../main/database.js";

export default {
    id: "ticket-set-button-modal-3",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const message = await interaction.channel?.messages.fetch(
            interaction.message?.id as string
        );
        const content = message?.content.split("|");

        if (!content) throw new Error("Invalid Content");

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: content[2]
            }
        });
        const modal = new ModalBuilder();

        const name = new TextInputBuilder();
        const type = new TextInputBuilder();
        const placeholder = new TextInputBuilder();
        const messageid = new TextInputBuilder();
        const uuid = new TextInputBuilder();

        modal
            .setTitle("Setup a Option")
            .setCustomId("ticket-set-button-modal-3-setup");

        name
            .setLabel("Name")
            .setCustomId("ticket-menu-modal-option-setup-name")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Name of the Menu")
            .setValue("Why you open a Ticket?")
            .setRequired(true);

        placeholder
            .setLabel("Placeholder")
            .setCustomId("ticket-menu-modal-option-setup-placeholder")
            .setStyle(TextInputStyle.Short)
            .setValue("Provide a Reason for your the Ticket")
            .setRequired(false);

        type
            .setLabel("Type")
            .setCustomId("ticket-menu-modal-option-setup-type")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Short/Paragraph")
            .setValue("Short")
            .setRequired(true);


        uuid
            .setLabel("UUID")
            .setCustomId("ticket-menu-modal-option-setup-uuid")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("NOT CHANGE THIS")
            .setValue(content[2])
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(name),
            new ActionRowBuilder<TextInputBuilder>().addComponents(type),
            new ActionRowBuilder<TextInputBuilder>().addComponents(placeholder),
            new ActionRowBuilder<TextInputBuilder>().addComponents(uuid)
        );

        interaction.showModal(modal);
    }
};
