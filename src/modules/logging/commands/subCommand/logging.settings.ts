import {
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "logging.settings",
    options: {
        once: false,
        permission: PermissionType.Logging,
        cooldown: 3000,
        botPermissions: [
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageGuild,
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory,
        ],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },

    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});
        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");

        const webhookchannel = interaction.options.getChannel("channel") as TextChannel;
        const webhook = await webhookchannel.createWebhook({
            avatar: interaction.guild.iconURL(),
            name: "Logging Webhook",
        });

        const getChannel = webhook.url;
        const getLogType = interaction.options.getString("logtype");
        const guildId = interaction.guild.id;

        let data = await database.guildLoggings.findFirst({where: {GuildId: guildId}});
        if (!data) {
            data = await database.guildLoggings.create({data: {GuildId: guildId}});
        }

        const updateLogging = async (fields: Partial<typeof data>) => {
            await database.guildLoggings.update({
                where: {GuildId: guildId},
                data: fields,
            });
        };

        const emoji = await convertToEmojiPng("check", client.user.id);

        switch (getLogType) {
            case "all":
                await updateLogging({
                    AutoMod: getChannel,
                    Channel: getChannel,
                    Emoji: getChannel,
                    Guild: getChannel,
                    Integration: getChannel,
                    Invite: getChannel,
                    Member: getChannel,
                    Message: getChannel,
                    Moderation: getChannel,
                    Reaction: getChannel,
                    Role: getChannel,
                    SoundBoard: getChannel,
                    Sticker: getChannel,
                    Thread: getChannel,
                    Voice: getChannel,
                    Webhook: getChannel,
                    Ban: getChannel,
                    Kick: getChannel,
                    Poll: getChannel,
                    Stage: getChannel,
                    Event: getChannel,
                });
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set all logging`,
                });

            case "message":
                await updateLogging({Message: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Message logging`,
                });

            case "event":
                await updateLogging({Event: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Event logging`,
                });

            case "channel":
                await updateLogging({Channel: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Channel logging`,
                });

            case "stage":
                await updateLogging({Stage: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Stage logging`,
                });

            case "automod":
                await updateLogging({AutoMod: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Automod logging`,
                });

            case "moderation":
                await updateLogging({Moderation: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Moderation logging`,
                });

            case "emoji":
                await updateLogging({Emoji: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Emoji logging`,
                });

            case "webhook":
                await updateLogging({Webhook: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Webhook logging`,
                });

            case "soundboard":
                await updateLogging({SoundBoard: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Soundboard logging`,
                });

            case "member":
                await updateLogging({Member: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Member logging`,
                });

            case "role":
                await updateLogging({Role: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Role logging`,
                });

            case "sticker":
                await updateLogging({Sticker: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Sticker logging`,
                });

            case "invite":
                await updateLogging({Invite: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Invite logging`,
                });

            case "integrations":
                await updateLogging({Integration: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Integration logging`,
                });

            case "guild":
                await updateLogging({Guild: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Guild logging`,
                });

            case "reaction":
                await updateLogging({Reaction: getChannel});
                return interaction.editReply({
                    content: `## ${emoji} You have successfully set Reaction logging`,
                });

            default:
                return interaction.editReply({
                    content: `## ${await convertToEmojiPng("error", client.user.id)} Please select a valid logging type!`,
                });
        }
    },
};
