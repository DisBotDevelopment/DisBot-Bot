import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Client,
    EmbedBuilder,
    MessageFlags,
    ModalBuilder,
    PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuInteraction,
    TextChannel,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuInteraction,
} from "discord.js";
import shortUUID from "short-uuid";
import {manageMessages, readMessageHistory, sendMessages, viewChannel,} from "../../../api/disbot-api.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js"
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {ticketErrorMessage, ticketHelper, ticketModalHelper} from "../../../helper/ticketHelper.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    id: "ticket-create-selectmenu",

    /**
     * @param {StringSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: StringSelectMenuInteraction, client: ExtendedClient) {
        const uuid = interaction.values[0]
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
