import {
    ActionRowBuilder, AttachmentBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ChannelSelectMenuBuilder,
    ChannelType,
    ContainerBuilder, FileBuilder, GuildMember,
    MessageFlags,
    PrivateThreadChannel,
    TextChannel,
    TextDisplayBuilder, UserSelectMenuBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-tickets-delete-cancel",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        await interaction.deleteReply("Action Aborted")

    },
};
