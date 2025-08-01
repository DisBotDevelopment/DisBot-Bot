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
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import moment from "moment/moment.js";

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
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} This giveaway is already paused.`,
                flags: MessageFlags.Ephemeral,
            });
        }
        if (data?.Ended == true) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} This giveaway has already ended.`,
                flags: MessageFlags.Ephemeral,
            });
        }
        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} A giveaway with this message URL does not exist.`,
                flags: MessageFlags.Ephemeral,
            });
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
        if (!channelObj?.isSendable()) return interaction.reply({
            content: `## ${await convertToEmojiPng("error", client.user?.id)} I cannot send messages in this channel.`,
            flags: MessageFlags.Ephemeral,
        });


        const message = await channelObj.messages.fetch(messageId);

        const durationForTimestamp = ms(data.Time as ms.StringValue)
        const createdAtForTimestamp = data.CreatedAt
        const endTimeForTimestamp = moment(createdAtForTimestamp).add(durationForTimestamp, "milliseconds").toDate()

        const timeStamp = Math.floor(endTimeForTimestamp.getTime() / 1000)

        message.edit({
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(data.Content.replace("{action.message}", `**${await convertToEmojiPng("giveaway", client.user.id)} Giveaway paused**`).replace("{prize}", data.Prize as string).replace("{winner}", String(data.Winners)).replace("{requirements}", data.Requirements[0] ? `<@&${data.Requirements[0]}>` : "No requirements").replace("{hostedBy}", `<@${interaction.user.id}>`).replace("{duration}", `<t:${timeStamp}:R>`).replace("{entrys}", data.Entrys ? data.Entrys.length.toString() : "N/A"))
                ).addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`giveaway-enter:${data.UUID}`)
                        .setEmoji("<:giveaway:1366020996934668419>")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                )),
            ], flags: MessageFlags.IsComponentsV2,
        })

        await interaction.reply({
            content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} The giveaway has been paused.`,
            flags: MessageFlags.Ephemeral,
        });

    }
};
