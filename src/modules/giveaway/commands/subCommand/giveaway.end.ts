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
    subCommand: "giveaway.end",
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

        if (data.Ended == true) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} The giveaway has already ended.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.giveaways.update(
            {
                where: {
                    ChannelId: channelId,
                    MessageId: messageId,
                    GuildId: interaction.guild?.id
                },
                data: {
                    Time: "1s",
                }
            },
        );

        await interaction.reply({
            content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} The giveaway will end in 10 seconds.`,
            flags: MessageFlags.Ephemeral,
        });


    }
};
