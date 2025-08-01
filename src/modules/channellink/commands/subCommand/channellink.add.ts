import {ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import {randomUUID} from "crypto";

export default {
    subCommand: "channellink.add",
    options: {
        once: false,
        permission: PermissionType.ChatFilter,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
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
        if (!interaction.member) throw new Error("Member not found");

        const channel = interaction.options.getChannel("channel");

        const data = await database.channelLinks.findFirst({
            where: {
                ChannelId: channel?.id,
                GuildId: interaction.guildId
            }
        });

        if (!data) {
            await database.channelLinks.create({
                data: {
                    UUID: randomUUID(),
                    ChannelId: channel?.id,
                    GuildId: interaction.guild.id,
                    WebhookUrls: [interaction.options.getString("webhook-url")]
                }
            });
            const embed = new EmbedBuilder()
                .setTitle("Channel Added")
                .setDescription(
                    `The Channel ${channel} is now connected with the Channel from the Webhook.`
                )
                .setColor("#00FF00");
            await interaction.editReply({embeds: [embed]});
        } else {
            if (data.WebhookUrls.includes(interaction.options.getString("webhook-url") as string)) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error")
                            .setDescription(
                                `The Channel ${channel} is already connected with the webhook url!`
                            )
                            .setColor("#2B2D31")
                    ]
                });

            }

            await database.channelLinks.update({
                where: {
                    UUID: data.UUID,
                },
                data: {
                    WebhookUrls: {
                        push: interaction.options.getString("webhook-url")
                    }
                }
            })

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Channel Added")
                        .setDescription(
                            `The Channel ${channel} is now connected with the extra webhook Url`
                        )
                        .setColor("#00FF00")
                ]
            });
        }
    }
};
