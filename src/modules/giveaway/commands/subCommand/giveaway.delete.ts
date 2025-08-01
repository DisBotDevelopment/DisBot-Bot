import {
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
import {database} from "../../../../main/database.js";

export default {
    subCommand: "giveaway.delete",
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

        const channel = interaction.options.getString("message-url") as string;
        const messageId = channel.split("/").pop() as string;
        const channelId = channel.split("/")[5] as string;

        const data = await database.giveaways.findFirst({
            where: {
                ChannelId: channelId,
                MessageId: messageId,
                GuildId: interaction.guild?.id
            }
        });

        if (!client.user) return;
        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} A giveaway with this message URL does not exist.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (data.Ended == false) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} The giveaway has not ended yet.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.giveaways.delete(
            {
                where: {
                    ChannelId: channelId,
                    MessageId: messageId,
                    GuildId: interaction.guild?.id
                }
            },
        );

        await interaction.reply({
            content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} The giveaway has been deleted.`,
            flags: MessageFlags.Ephemeral,
        });


    }
};
