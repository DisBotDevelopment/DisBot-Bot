import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "twitch-update-messageid-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        const messageId = interaction.fields.getTextInputValue("messageId")
        const uuid = interaction.customId.split(":")[1]

        const msgDB = await database.messageTemplates.findFirst({
            where: {
                Name: messageId,
            }
        })

        if (!msgDB) {
            if (!client.user) throw new Error("Client user is undefined")
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No Message ID Found`, interaction, true)
        }

        await database.guildTwitchNotifications.update({
            where: {
                UUID: uuid,
                GuildId: interaction.guild?.id
            }, data: {
                MessageTemplateId: messageId
            }
        })

        if (!client.user) throw new Error("Client user is undefined")
        await interaction.deferUpdate()
    }
};
