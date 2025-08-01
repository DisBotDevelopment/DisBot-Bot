import {ButtonStyle, Client, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "twitch-add-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client not ready");

        const getMessageID = interaction.fields.getTextInputValue(
            "twitch-add-message-id"
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

        await database.twitchNotifications.update(
            {
                where: {
                    UUID: interaction.customId.split(":")[1]
                },
                data: {
                    MessageTemplateId: getMessageID
                }
            }
        );

        await interaction.reply({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} Successfully updated the message for the Twitch command.\n-# Please enable the Notification`,
            components: [], flags: MessageFlags.Ephemeral
        });
    }
};
