import {
    ChatInputCommandInteraction,
    ContainerBuilder,
    MediaGalleryItemBuilder,
    MessageFlags,
    PermissionFlagsBits, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../../types/ExtendedClient.js";
import {isInDevelopment} from "../../../../helper/utilityHelper.js";

export default {
    subCommand: "moderation.scout",
    options: {
        once: false,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
        userPermissions: [PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        // INDEV
        await isInDevelopment(client, interaction)
    },
};
