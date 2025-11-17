import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-toggle-invite-logging-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client is not ready");
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const data = await database.vanitys.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        const newSlug = interaction.fields.getTextInputValue("vanity-toggle-invite-logging-message-input");

        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This vanity URL is not found.`, interaction, true, "deferReply")
        }

        const messageData = await database.messageTemplates.findFirst({
            where: {
                Name: newSlug
            }
        })

        if (!messageData)
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No message template found for this vanity URL.`, interaction, true, "deferReply")


        await database.vanityAnalytic.update(
            {
                where: {
                    VanityId: data.UUID
                }, data: {
                    TrackMessageId: messageData.Name,
                }
            })
        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} The invite logging message template has been updated successfully.`, interaction, true, "deferReply")
    }
};
