import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder, GuildTextBasedChannel,
    MessageFlags,
    TextDisplayBuilder
} from "discord.js";
import moment from "moment";
import ms from "ms";
import {convertToEmojiPng} from "../helper/emojis.js";
import {ExtendedClient} from "../types/client.js";
import {database} from "../main/database.js";

export async function giveaway(client: ExtendedClient) {

    const data = await database.giveaways.findMany();

    if (!data) return;
    for (const giveaway1 of data) {

        const guild = await client.guilds.fetch(giveaway1.GuildId as string)
        if (!guild) continue;
        const channel = await guild.channels.fetch(giveaway1.ChannelId as string) as GuildTextBasedChannel
        if (!channel) continue;
        if (!channel.isSendable()) continue;
        const message = await channel.messages.fetch(giveaway1.MessageId as string)
        if (!message) continue;

        if (giveaway1.Paused) continue;
        if (giveaway1.Ended) continue;

        const duration = ms(giveaway1.Time as ms.StringValue)
        const createdAt = giveaway1.CreatedAt
        const endTime = moment(createdAt).add(duration, "milliseconds").toDate()

        const timeStamp = Math.floor(endTime.getTime() / 1000)

        const now = new Date()
        if (now >= endTime) {

            const doneWinners: string[] = [];

            const shuffled = giveaway1.Entrys
                .filter(entry => entry)
                .sort(() => Math.random() - 0.5);

            const winnersCount = giveaway1.Winners ?? 1;

            for (let i = 0; i < winnersCount && i < shuffled.length; i++) {
                doneWinners.push(shuffled[i]);
            }

            if (!client.user) continue;
            message.edit({
                components: [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(giveaway1.Content.replace("{action.message}", `**${await convertToEmojiPng("giveaway", client.user.id)} Giveaway ended**`).replace("{prize}", giveaway1.Prize as string).replace("{winner}", String(giveaway1.Winners)).replace("{requirements}", giveaway1.Requirements[0] ? `<@&${giveaway1.Requirements[0]}>` : "No requirements").replace("{hostedBy}", `<@${giveaway1.HostedBy}>`).replace("{duration}", `<t:${timeStamp}:R>`).replace("{entrys}", giveaway1.Entrys.length.toString())
                            )).addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`giveaway-enter:${giveaway1.UUID}`)
                            .setEmoji("<:giveaway:1366020996934668419>")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    )),

                ], flags: MessageFlags.IsComponentsV2,
            })

            await database.giveaways.update(
                {
                    where: {
                        UUID: giveaway1.UUID
                    },
                    data: {
                        Ended: true,
                        EndedAt: new Date(),
                        EndedBy: "System",
                        WinnerIds: {
                            set: doneWinners
                        }
                    }
                })

            const endedBy = await database.giveaways.findFirst({
                where: {
                    UUID: giveaway1.UUID
                }
            })

            const endedMsg = await message.reply({
                content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} **Giveaway Winners** \n\n` +
                    `**Winners:** \n` +
                    `${doneWinners.map((winner) => `<@${winner}>`).join(", ") || "No winners"}` +
                    `\n> **Giveaway ended at:** <t:${timeStamp}:F>` +
                    `\n> **Giveaway ended by:** ${endedBy?.EndedBy == "System" ? client.user.tag : `<@${giveaway1.EndedBy}>`}`,
                allowedMentions: {users: doneWinners},
                embeds: [],
                components: [],
                flags: MessageFlags.SuppressEmbeds,
            })

            await database.giveaways.update(
                {
                    where: {
                        UUID: giveaway1.UUID
                    },
                    data: {
                        EndedMessage: (endedMsg).id,
                    }
                })

        }
    }
}