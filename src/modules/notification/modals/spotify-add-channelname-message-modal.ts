import axios from "axios";
import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "spotify-add-channelname-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client user not found");
        const messageTemplate = interaction.fields.getTextInputValue("messageTemplate");
        const id = interaction.customId.split(":")[1];

        const data = await database.spotifyNotifications.findFirst({
            where: {UUID: id}
        });

        const message = await database.messageTemplates.findFirst({
            where: {
                Name: messageTemplate
            }
        })

        if (!message) {
            await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Message Template not found with ID ${messageTemplate}\n-# Setup your message later in the Notification Management`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        await database.spotifyNotifications.update(
            {
                where: {UUID: id},
                data: {
                    MessageTemplateId: messageTemplate
                }
            }
        );

        const config = await database.disBot.findFirst({
            where: {
                GetConf: "config"
            }
        });
        const req = await axios.get(`https://api.spotify.com/v1/shows/${data?.ShowId as string}`, {
            headers: {
                Authorization: `Bearer ${config?.SpotifyToken}`
            }
        });


        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Notification for ${req.data.name} has beed saved successfully!\n-# Don't forget to enable the notification`,
            flags: MessageFlags.Ephemeral
        });


    }
};
