import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "spotify-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");
        const messageTemplate =
            interaction.fields.getTextInputValue("messageTemplate");
        const id = interaction.customId.split(":")[1];

        const message = await database.messageTemplates.findFirst({
            where: {
                Name: messageTemplate,
            }
        });

        if (!message) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Invalid Message ID! Try again.`, interaction, true)
        }


        await database.guildSpotifyNotifications.update(
            {
                where: {UUID: id},
                data: {
                    MessageTemplateId: messageTemplate,
                }
            }
        );

        await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Added the Message Template to the notification.`, interaction, true)
    },
};
