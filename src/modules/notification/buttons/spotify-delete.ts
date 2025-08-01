import {ButtonInteraction, ButtonStyle, MessageFlags, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "spotify-delete",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client User is not defined");

        const uuid = interaction.customId.split(":")[1];

        const data = await database.spotifyNotifications.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No Spotify Show Found`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.spotifyNotifications.delete({
            where: {
                UUID: uuid
            }
        });

        interaction.update({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Spotify Show Deleted`,
            embeds: [],
            components: [],
        });
    }
};
