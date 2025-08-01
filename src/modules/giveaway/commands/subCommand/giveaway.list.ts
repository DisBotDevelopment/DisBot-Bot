import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";

export default {
    subCommand: "giveaway.list",
    options: {
        once: false,
        permission: PermissionType.Giveaway,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageRoles],
        userPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageRoles],
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


        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("giveaway-list")
                .setEmoji("<:giveaway:1366020996934668419>")
                .setStyle(ButtonStyle.Secondary)
        );

        if (!client.user) return;
        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Click on the button below to see the list of giveaways.`,
            flags: MessageFlags.Ephemeral,
            components: [row]
        });


    }
};
