import {
    ActionRowBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    MessageFlags,
    ModalBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import {convertToEmojiToPng} from "../../../../helper/emojis.js";

export default {
    subCommand: "welcome.channel",
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
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        })

        const channel = interaction.options.getChannel("channel");

        const data = await database.guildWelcomeSetup.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        })

        if (!data) {
            await database.guildWelcomeSetup.create({
                data: {
                    Image: false,
                    ChannelId: channel.id,
                    Guilds: {
                        connect: {
                            GuildId: interaction.guild.id
                        },
                    }
                }
            })
        }

        await database.guildWelcomeSetup.update({
            where: {
                GuildId: interaction.guild.id
            },
            data: {
                ChannelId: channel.id
            }
        })

        await interaction.editReply({
            content: `## ${await convertToEmojiToPng("check")} Set Channel ${channel} for your welcome module.`
        })
    },
};
