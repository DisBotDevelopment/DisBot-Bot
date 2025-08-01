import {
    ActionRowBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-edit-message",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const data = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.customId.split(":")[1]
            }
        });
        const modal = new ModalBuilder();

        const name = new TextInputBuilder();

        modal
            .setTitle("Edit Message Content")
            .setCustomId("messages-edit-message-modal:" + data?.Name);

        name
            .setLabel("Message Content")

            .setCustomId("content")
            .setStyle(TextInputStyle.Paragraph)
            .setValue(data?.Content ? data.Content : "")
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(name)
        );

        interaction.showModal(modal);
    }
};
