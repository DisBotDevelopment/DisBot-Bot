import {
    ActionRowBuilder,
    ButtonBuilder,
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
import {ticketHelper} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-create-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]
        await ticketHelper(
            uuid,
            "interaction",
            client,
            interaction,
            interaction
        )
    },
};
