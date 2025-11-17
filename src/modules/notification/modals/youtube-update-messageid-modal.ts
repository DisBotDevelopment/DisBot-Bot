import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "youtube-update-messageid-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const messageId = interaction.fields.getTextInputValue("messageId");
        const uuid = interaction.customId.split(":")[1];

        const msgDB = await database.messageTemplates.findFirst({
            where: {
                Name: messageId
            },
        });

        if (!msgDB) {
            if (!client.user) throw new Error("Client user is undefined");
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} No Message ID Found`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.guildYoutubeNotifications.updateMany(
            {
                where: {
                    UUID: uuid,
                    GuildId: interaction.guild?.id,
                },
                data: {
                    MessageTemplateId: messageId,
                }
            }
        );

        await interaction.deferUpdate()
    },
};
