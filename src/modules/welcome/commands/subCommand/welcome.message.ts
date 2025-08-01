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
import {ExtendedClient} from "../../../../types/client.js";
import {PermissionType} from "../../../../enums/permissionType.js";

export default {
    subCommand: "welcome.message",
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
        const channel = new TextInputBuilder();

        modal.setTitle("Create a Message").setCustomId("welcome-message-create");

        message
            .setLabel("Message Template")
            .setCustomId("welcome-message-create-name")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
        channel
            .setLabel("Channel ID")
            .setCustomId("welcome-message-create-channel")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("NOT CHANGE")
            .setValue(`${interaction.options.getChannel("channel")?.id}`)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(message),
            new ActionRowBuilder<TextInputBuilder>().addComponents(channel)
        );

        await interaction.showModal(modal);
    }
};
