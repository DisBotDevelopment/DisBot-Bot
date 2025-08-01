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
    subCommand: "giveaway.reroll",
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

        if (data.Ended == false) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} The giveaway has not ended yet.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const doneWinners: string[] = [];

        const shuffled = data.Entrys
            .filter(entry => entry)
            .sort(() => Math.random() - 0.5);

        const winnersCount = data.Winners ?? 1;

        for (let i = 0; i < winnersCount && i < shuffled.length; i++) {
            doneWinners.push(shuffled[i]);
        }

        const giveawyChannel = client.channels.cache.get(data.ChannelId as string)
        const message = await (giveawyChannel as any).messages.fetch(data.EndedMessage as string)
        if (!message) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} A giveaway with this message URL does not exist.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const timeStamp = Math.floor(Number(data.EndedAt?.getTime()) / 1000)

        const endedMsg = await message.edit({
            content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} **Giveaway Reroll**` +
                `\n**Winners:** \n` +
                `${doneWinners.map((winner) => `<@${winner}>`).join(", ") || "No winners"}` +
                `\n> **Giveaway ended at:** <t:${timeStamp}:F>` +
                `\n> **Giveaway ended by:** ${data.EndedBy == "System" ? client.user : `<@${data.EndedBy}>`}` +
                `\n-# **Old Winners:** \n` +
                `-# ${data.WinnerIds.map((winner) => `<@${winner}>`).join(", ") || "No winners"}`,
            allowedMentions: {users: doneWinners},
            embeds: [],
            components: [],
            flags: MessageFlags.SuppressEmbeds,
        })


        await database.giveaways.update(
            {
                where: {
                    UUID: data.UUID
                },
                data: {
                    Ended: true,
                    EndedAt: new Date(),
                    EndedBy: "System",
                    WinnerIds: doneWinners,
                    EndedMessage: (await endedMsg).id,
                }
            })

        await interaction.reply({
            content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} Reroll done!`,
            flags: MessageFlags.Ephemeral,
        });

    }
};
