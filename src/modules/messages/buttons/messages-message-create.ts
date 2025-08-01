import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-message-create",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();

        const name = new TextInputBuilder();

        const uuid = interaction.customId.split(":")[1];
        const data = await database.messageTemplates.findFirst({
            where: {
                Name: uuid,
            }
        });

        modal
            .setTitle("Set Message Content")
            .setCustomId("messages-message-content:" + uuid);

        name
            .setLabel("Message Content")

            .setCustomId("content")
            .setStyle(TextInputStyle.Paragraph)
            .setValue(data?.Content || "")
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(name)
        );

        interaction.showModal(modal);
    }
};
