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
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

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
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} A giveaway with this message URL does not exist.`,
                flags: MessageFlags.Ephemeral,
            });
        }
        if (data.Paused == false) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} This giveaway is already started.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (data.Ended == true) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} This giveaway has ended.`,
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
                    Paused: false,
                }
            },
        );

        interaction.reply({
            content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} The giveaway has been started.`,
            flags: MessageFlags.Ephemeral,
        });

        const channelObj = client.guilds.cache.get(interaction.guild?.id as string)?.channels.cache.get(channelId);
        if (!channelObj?.isSendable()) return interaction.reply({
            content: `## ${await convertToEmojiPng("error", client.user?.id)} I cannot send messages in this channel.`,
            flags: MessageFlags.Ephemeral,
        });


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
                        .setContent(data.Content.replace("{action.message}", `**${await convertToEmojiPng("giveaway", client.user.id)} Giveaway Started**`).replace("{prize}", data.Prize as string).replace("{winner}", String(data.Winners)).replace("{requirements}", role ? `<@&${role.id}>` : "No requirements").replace("{hostedBy}", `<@${interaction.user.id}>`).replace("{duration}", `<t:${timeStamp}:R>`).replace("{entrys}", data.Entrys ? data.Entrys.length.toString() : "N/A")
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
