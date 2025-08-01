import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

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
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} Invalid Message ID! Try again.`, flags: MessageFlags.Ephemeral
            });
        }

        await database.youtubeNotifications.update(
            {
                where: {
                    UUID: interaction.customId.split(":")[1]
                },
                data: {
                    MessageTemplateId: getMessageID
                }
            }
        );


        interaction.reply({
            content: `## ${await convertToEmojiPng(
                "text",
                client.user.id
            )} Successfully updated the message for the YouTube command.\n-# Please enable the Notification.`,
            components: [], flags: MessageFlags.Ephemeral
        });
    }
};
