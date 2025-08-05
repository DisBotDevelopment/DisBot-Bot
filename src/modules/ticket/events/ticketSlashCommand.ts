import {ChatInputCommandInteraction, EmbedBuilder, Events, GuildMember, MessageFlags} from "discord.js";
import {inviteTracker} from "../../../systems/inviteTracker/inviteTracker.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {ticketHelper, ticketModalHelper} from "../../../helper/ticketHelper.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    name: Events.InteractionCreate,

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {

        if (interaction.isChatInputCommand()) {

            const data = await database.ticketSetups.findFirst({
                include: {
                    ModalOptions: true
                },
                where: {
                    SlashCommandId: interaction.commandId
                }
            })
            if (!data) {
            } else {

                if (data.HasModal) {
                    await ticketModalHelper(
                        data.CustomId,
                        data.ModalTitle,
                        data.ModalOptions,
                        interaction,
                        client,
                    )
                }
                await ticketHelper(
                    data.CustomId,
                    "interaction",
                    client,
                    interaction
                )
            }
        }
    }
}