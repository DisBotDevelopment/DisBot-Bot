import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

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
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No Message ID Found`,
                flags: MessageFlags.Ephemeral
            })
        }

        await database.twitchNotifications.update({
            where: {
                UUID: uuid,
                GuildId: interaction.guild?.id
            }, data: {
                MessageTemplateId: messageId
            }
        })

        if (!client.user) throw new Error("Client user is undefined")
        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Your message Id has been updated to \`${messageId}\``,
            flags: MessageFlags.Ephemeral
        })


    }
};
