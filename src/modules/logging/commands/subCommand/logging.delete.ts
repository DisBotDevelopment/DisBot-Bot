import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";

export default {
    subCommand: "logging.delete",
    options: {
        once: false,
        permission: PermissionType.Logging,
        cooldown: 3000,
        botPermissions: [
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageGuild,
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory
        ],
        userPermissions: [PermissionFlagsBits.ManageGuild],
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

        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");

        const getLogType = interaction.options.getString("delete");

        const data = await database.guildLoggings.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        });

        if (!data) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} You have not set any logging yet`
            });
        }

        const resetLog = async (fieldName: string) => {
            await database.guildLoggings.updateMany({
                where: {GuildId: interaction.guild.id},
                data: {[fieldName]: null}
            });

            return interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} You have successfully reset ${fieldName} logging`
            });
        };

        switch (getLogType) {
            case "all": {
                await database.guildLoggings.updateMany({
                    where: {GuildId: interaction.guild.id},
                    data: {
                        AutoMod: null,
                        Channel: null,
                        Emoji: null,
                        Guild: null,
                        Integration: null,
                        Invite: null,
                        Member: null,
                        Message: null,
                        Moderation: null,
                        Reaction: null,
                        Role: null,
                        SoundBoard: null,
                        Sticker: null,
                        Thread: null,
                        Voice: null,
                        Webhook: null,
                        Ban: null,
                        Kick: null,
                        Poll: null,
                        Stage: null,
                        Event: null
                    }
                });

                return interaction.editReply({
                    content: `## ${await convertToEmojiPng("check", client.user.id)} You have successfully reset all logging`
                });
            }

            case "message":
                return resetLog("Message");
            case "event":
                return resetLog("Event");
            case "stage":
                return resetLog("Stage");
            case "channel":
                return resetLog("Channel");
            case "automod":
                return resetLog("AutoMod");
            case "moderation":
                return resetLog("Moderation");
            case "emoji":
                return resetLog("Emoji");
            case "webhook":
                return resetLog("Webhook");
            case "soundboard":
                return resetLog("SoundBoard");
            case "member":
                return resetLog("Member");
            case "role":
                return resetLog("Role");
            case "sticker":
                return resetLog("Sticker");
            case "invite":
                return resetLog("Invite");
            case "integrations":
                return resetLog("Integration");
            case "guild":
                return resetLog("Guild");
            case "reaction":
                return resetLog("Reaction");
            case "polls":
                return resetLog("Poll");
            case "thread":
                return resetLog("Thread");
            case "voice":
                return resetLog("Voice");

            default:
                return interaction.editReply({
                    content: `## ${await convertToEmojiPng("error", client.user.id)} Unknown logging type`
                });
        }
    }
};
