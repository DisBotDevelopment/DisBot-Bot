import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "youtube-add-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client not ready");

        const getMessageID = interaction.fields.getTextInputValue(
            "youtube-add-message-id"
        );

        const isMessage = await database.messageTemplates.findFirst({
            where: {
                Name: getMessageID
            }
        });

        if (!isMessage) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Invalid Message ID! Try again.`, interaction, true)
        }

        await database.guildYoutubeNotifications.update(
            {
                where: {
                    GuildId: interaction.guild.id,
                    UUID: interaction.customId.split(":")[1]
                },
                data: {
                    MessageTemplateId: getMessageID
                }
            }
        );


        await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Added the Message Template to the notification.`, interaction, true)
    }
};
