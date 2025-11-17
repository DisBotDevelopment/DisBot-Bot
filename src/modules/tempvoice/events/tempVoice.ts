import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    Events,
    PermissionFlagsBits,
    PermissionsBitField,
    VoiceState
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {ExtendedClient} client
     */
    async execute(
        oldState: VoiceState,
        newState: VoiceState,
        client: ExtendedClient
    ) {
        
    },

    name: Events.VoiceStateUpdate
};
