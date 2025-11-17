import {
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {database} from "../../../../main/database.js";
import {sendDefaultMessage} from "../../../../helper/utilityHelper.js";

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
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} A giveaway with this message URL does not exist.`, interaction, true, "reply")
        }

        if (data.Ended == false) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The giveaway has not ended yet.`, interaction, true, "reply")
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
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} A giveaway with this message URL does not exist.`, interaction, true, "reply")
        }

        const timeStamp = Math.floor(Number(data.EndedAt?.getTime()) / 1000)

        const endedMsg = await message.edit({
            content: `## ${await convertToEmojiToPng("giveaway")} **Giveaway Reroll**` +
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
        
        return await sendDefaultMessage(`## ${await convertToEmojiToPng("giveaway")} Reroll done!`, interaction, true, "reply")
    }
};
