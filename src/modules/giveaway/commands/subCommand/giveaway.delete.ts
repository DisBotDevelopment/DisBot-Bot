import {
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiToPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import {sendDefaultMessage} from "../../../../helper/utilityHelper.js";

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
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} A giveaway with this message URL does not exist.`, interaction, true, "reply")
        }

        if (data.Ended == false) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The giveaway has not ended yet.`, interaction, true, "reply")
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

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("giveaway")} The giveaway has been deleted.`, interaction, true, "reply")
    }
};
