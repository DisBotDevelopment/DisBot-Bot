import {ButtonInteraction, ChannelType, MessageFlags, TextChannel} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    id: "button-ticket-claim",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const {guild, channel} = interaction;

        if (!client.user) throw new Error("Client not Found!");

        let emoji;
        await convertToEmojiPng("support", client.user.id).then((result) => {
            emoji = result;
        });

        let ticketData;
        if (channel?.type !== ChannelType.PrivateThread) {
            ticketData = await database.tickets.findFirst({
                where: {
                    ChannelId: interaction.channel?.id
                }
            });
        } else {
            ticketData = await database.tickets.findFirst({
                where: {
                    ThreadId: interaction.channel?.id
                }
            });
        }

        const member = guild?.members.cache.get(interaction.user.id);

        if (member?.roles.cache.has(ticketData?.Handlers as string)) {
            if (interaction.user.id == ticketData?.UserhasClaim) {
                ticketData.Claimed = false;
                ticketData.UserhasClaim = "";

                await ticketData.save();

                interaction.deferUpdate();

                (channel as TextChannel)?.send({
                    content: `## ${emoji} **The Ticket is now unclaimed by ${interaction.member}**`
                });
            } else {
                if (ticketData?.Claimed == false) {
                    ticketData.Claimed = true;
                    ticketData.UserhasClaim = interaction.user.id;
                    await ticketData.save();
                    interaction.deferUpdate();

                    (channel as TextChannel).send({
                        content: `## ${emoji} **The Ticket is now claimed by ${interaction.member}**`
                    });
                } else {
                    interaction.reply({
                        content: `## ${await convertToEmojiPng(
                            "error",
                            client.user.id
                        )} The Ticket is already claimed by <@${ticketData?.UserhasClaim}>`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        } else {
            interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} You don't have the permission to claim this ticket.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
