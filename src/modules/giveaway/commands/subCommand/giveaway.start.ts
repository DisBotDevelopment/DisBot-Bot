import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits, TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import moment from "moment";
import ms from "ms";
import {ExtendedClient} from "../../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import {sendDefaultMessage} from "../../../../helper/utilityHelper.js";

export default {
    subCommand: "giveaway.start",
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
        if (data.Paused == false) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This giveaway is already started.`, interaction, true, "reply")
        }

        if (data.Ended == true) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This giveaway has ended.`, interaction, true, "reply")
        }

        await database.giveaways.update(
            {
                where: {
                    ChannelId: channelId,
                    MessageId: messageId,
                    GuildId: interaction.guild?.id
                },
                data: {
                    Paused: false,
                }
            },
        );

        sendDefaultMessage(`## ${await convertToEmojiToPng("giveaway")} The giveaway has been started.`, interaction, true, "reply")

        const channelObj = client.guilds.cache.get(interaction.guild?.id as string)?.channels.cache.get(channelId);
        if (!channelObj?.isSendable()) return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} I cannot send messages in this channel.`, interaction, true, "reply")


        const message = await channelObj.messages.fetch(messageId);
        let role = interaction.guild?.roles.cache.get(data.Requirements[0] as string)

        const duration = ms(data.Time as ms.StringValue)
        const createdAt = Date.now()
        const endTime = moment(createdAt).add(duration, "milliseconds").toDate()
        const timeStamp = Math.floor(endTime.getTime() / 1000)

        message.edit({
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(data.Content.replace("{action.message}", `**${await convertToEmojiToPng("giveaway")} Giveaway Started**`).replace("{prize}", data.Prize as string).replace("{winner}", String(data.Winners)).replace("{requirements}", role ? `<@&${role.id}>` : "No requirements").replace("{hostedBy}", `<@${interaction.user.id}>`).replace("{duration}", `<t:${timeStamp}:R>`).replace("{entrys}", data.Entrys ? data.Entrys.length.toString() : "N/A")
                        )).addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`giveaway-enter:${data.UUID}`)
                        .setEmoji("<:giveaway:1366020996934668419>")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false)
                )),
            ],
            flags: MessageFlags.IsComponentsV2,
        })

    }
};
