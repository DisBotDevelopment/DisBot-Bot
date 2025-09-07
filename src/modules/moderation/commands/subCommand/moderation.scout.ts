import {
    ChatInputCommandInteraction,
    ContainerBuilder,
    MediaGalleryItemBuilder,
    MessageFlags,
    PermissionFlagsBits, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

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

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${await convertToEmojiPng("info", client.user.id)} This Feature is currently in development!\n -# Normally I don't do this but for this system it would be too annoying to do it differently, I ask for your understanding`))

            ]
        })
    },
};
