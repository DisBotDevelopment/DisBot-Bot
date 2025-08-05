import {
    ActionRowBuilder, ButtonBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Events,
    GuildChannel,
    GuildMember, GuildTextBasedChannel,
    Message,
    MessageFlags,
    ButtonStyle
} from "discord.js";
import {inviteTracker} from "../../../systems/inviteTracker/inviteTracker.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {ticketHelper, ticketModalHelper} from "../../../helper/ticketHelper.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    name: Events.MessageCreate,

    /**
     * @param {Message} message
     * @param {ExtendedClient} client
     */
    async execute(message: Message, client: ExtendedClient) {

        const data = await database.ticketSetups.findFirst({
            include: {
                ModalOptions: true
            },
            where: {
                GuildId: message.guildId,
                TextCommandName: message.content
            }
        })
        if (!data) {
        } else {
            await message.delete();
            if (data.HasModal) {
                return (message.channel as GuildTextBasedChannel).send({
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-create-button:" + data.CustomId)
                                .setLabel("Ticket")
                                .setEmoji("<:ticket:1400577766205816852>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                            await msg.delete()
                        }, 2000
                    )
                })
            }
            await ticketHelper(
                data.CustomId,
                "event",
                client,
                null,
                null,
                message,
            )
        }
    }
}