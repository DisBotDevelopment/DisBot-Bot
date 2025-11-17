import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    id: "commands-manager-permission",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client User is not defined");


        const modal = new ModalBuilder()
        const input = new TextInputBuilder()

        modal
            .setTitle("Set Permissions")
            .setCustomId("commands-manager-permission-modal:" + interaction.customId.split(":")[1])

        input
            .setCustomId("input")
            .setLabel("Permissions")
            .setPlaceholder("ManageChannel,ManageGuild - https://doc.xyzhub.link/s/disbot-perms")
            .setStyle(TextInputStyle.Paragraph)

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                input
            )
        )

        await interaction.showModal(modal)

    }
};
