import {
    ActionRowBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    MessageFlags,
    ModalBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/ExtendedClient.js";
import {PermissionType} from "../../../../enums/permissionType.js";

export default {
    subCommand: "leave.message",
    options: {
        once: false,
        permission: PermissionType.LeaveWelcome,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages],
        userPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {

        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");

        const modal = new ModalBuilder();

        const message = new TextInputBuilder();

        modal.setTitle("Create a Message").setCustomId("leave-message-create");

        message
            .setLabel("Message Template")
            .setCustomId("leave-message-create-name")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);


        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(message),
        );

        await interaction.showModal(modal);
    }
};
