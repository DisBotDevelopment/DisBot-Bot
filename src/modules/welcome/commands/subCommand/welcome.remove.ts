import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "welcome.remove",
    options: {
        once: false,
        permission: PermissionType.LeaveWelcome,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
        userPermissions: [PermissionFlagsBits.ManageMessages],
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
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });
        const {guild, member} = interaction;

        const willkommenData = await database.guildWelcomeSetups.findFirst({
            where: {
                GuildId: guild?.id
            }
        });
        if (!client.user) throw new Error("Client user not found");
        if (!willkommenData)
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} There is no welcome message set for this server.`
            });

        await database.guildWelcomeSetups.delete({
            where: {
                GuildId: guild?.id
            }
        });

        return interaction.editReply({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} Welcome message has been removed.`
        });
    }
};
