import {
    ActionRowBuilder,
    ButtonBuilder, ButtonInteraction,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    PermissionsBitField,
    TextChannel,
} from "discord.js";
import shortUUID from "short-uuid";
import {manageMessages, readMessageHistory, sendMessages, viewChannel,} from "../../../api/disbot-api.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {ticketErrorMessage, ticketHelper, ticketModalHelper} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-create-button",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1]
        const data = await database.ticketSetups.findFirst({
            include: {
                ModalOptions: true
            },
            where: {
                CustomId: uuid
            }
        })

        if (!data) {
            return await ticketErrorMessage("No Data!", interaction, client)
        }

        if (data?.HasModal) {
            await ticketModalHelper(
                data.CustomId,
                data.ModalTitle,
                data.ModalOptions,
                interaction,
                client,
            )
        }
        await ticketHelper(
            uuid,
            "interaction",
            client,
            interaction
        )
    },
};
