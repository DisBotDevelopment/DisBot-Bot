import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {PermissionType} from "../../../enums/permissionType.js";

export default {
    id: "logging-delete-note",
    options: {
        once: false,
        permission: PermissionType.Logging,
        cooldown: 3000,
        botPermissions: [
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageGuild,
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory
        ],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1]

        const modal = new ModalBuilder()
        const message = new TextInputBuilder()

        modal.setTitle("Delete Note")
            .setCustomId("logging-delete-note-modal:" + uuid)

        message
            .setLabel("Message")
            .setCustomId("message")
            .setPlaceholder("Use 1, 2, 3, 4, 5... (To get the number use the Show button)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                message
            )
        )
        await interaction.showModal(modal)
    }
};
