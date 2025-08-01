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
    subCommand: "leave.image",
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

        const channel = new TextInputBuilder();
        const title = new TextInputBuilder();
        const subtitle = new TextInputBuilder();
        const text = new TextInputBuilder();
        const color = new TextInputBuilder();

        modal.setTitle("Create a Image").setCustomId("leave-image-create");

        title
            .setLabel("Title")
            .setCustomId("leave-image-create-title")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Goodbye!")
            .setRequired(true);

        subtitle
            .setLabel("Subtitle")
            .setCustomId("leave-image-create-subtitle")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Bye bye!")
            .setRequired(true);

        text
            .setLabel("Text")
            .setCustomId("leave-image-create-text")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("{member.name}")
            .setRequired(true);

        color
            .setLabel("Color")
            .setCustomId("leave-image-create-color")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("#ffffff")
            .setRequired(true);

        channel
            .setLabel("Channel ID")
            .setCustomId("leave-message-create-channel")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("NOT CHANGE")
            .setValue(`${interaction.options.getChannel("channel")?.id}`)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(title),
            new ActionRowBuilder<TextInputBuilder>().addComponents(subtitle),
            new ActionRowBuilder<TextInputBuilder>().addComponents(text),
            new ActionRowBuilder<TextInputBuilder>().addComponents(color),
            new ActionRowBuilder<TextInputBuilder>().addComponents(channel)
        );

        interaction.showModal(modal);
    }
};
