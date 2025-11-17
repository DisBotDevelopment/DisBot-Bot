import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, ContainerBuilder,
    MessageFlags,
    PermissionFlagsBits, TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import ms from "ms";
import {ExtendedClient} from "../../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import moment from "moment/moment.js";
import {sendDefaultMessage} from "../../../../helper/utilityHelper.js";
import {replacePlaceholders} from "../../../../main/placeholder.js";

export default {
    subCommand: "giveaway.pause",
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
        if (!client.user) return;
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

        if (data?.Paused == true) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This giveaway is already paused.`, interaction, true, "reply")
        }
        if (data?.Ended == true) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This giveaway has already ended.`, interaction, true, "reply")
        }
        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} A giveaway with this message URL does not exist.`, interaction, true, "reply")
        }

        const duration = ms(data.Time as ms.StringValue);
        const createdAt = data.CreatedAt.getTime();
        const elapsed = Date.now() - createdAt;
        const remainingMs = Math.max(duration - elapsed, 0);

        await database.giveaways.update(
            {
                where: {
                    ChannelId: channelId,
                    MessageId: messageId,
                    GuildId: interaction.guild?.id
                },
                data: {
                    Paused: true,
                    Time: remainingMs.toString()
                }
            }
        );

        const channelObj = client.guilds.cache.get(interaction.guild?.id as string)?.channels.cache.get(channelId);
        if (!channelObj?.isSendable())
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} I cannot send messages in this channel.`, interaction, true, "reply")


        const message = await channelObj.messages.fetch(messageId);

        const durationForTimestamp = ms(data.Time as ms.StringValue)
        const createdAtForTimestamp = data.CreatedAt
        const endTimeForTimestamp = moment(createdAtForTimestamp).add(durationForTimestamp, "milliseconds").toDate()

        const timeStamp = Math.floor(endTimeForTimestamp.getTime() / 1000)

        const placeholderType = {
            giveaway: {
                action: {
                    message: ""
                },
                prize: data.Prize as string,
                winner: String(data.Winners),
                requirements: data.Requirements[0] ? `<@&${data.Requirements[0]}>` : "No requirements",
                hostedBy: `<@${data.HostedBy}>`,
                duration: `<t:${timeStamp}:R>`,
                entrys: data.Entrys ? data.Entrys.length.toString() : "N/A"
            }
        }
        const gMessage = replacePlaceholders(data.Content, placeholderType)

        await message.edit({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(gMessage)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`giveaway-enter:${data.UUID}`)
                                .setEmoji("<:giveaway:1366020996934668419>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )),
            ], flags: MessageFlags.IsComponentsV2,
        })

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This giveaway has already ended.`, interaction, true, "reply")
    }
};
