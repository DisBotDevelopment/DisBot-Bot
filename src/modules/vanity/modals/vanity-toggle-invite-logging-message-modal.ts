import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

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
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} This vanity URL is not found.`,
            });
            return;
        }

        const messageData = await database.messageTemplates.findFirst({
            where: {
                Name: newSlug
            }
        })

        if (!messageData) return interaction.editReply({
            content: `## ${await convertToEmojiPng("error", client.user.id)} No message template found for this vanity URL.`,
        })

        await database.vanityAnalytics.update(
            {
                where: {
                    VanityId: data.UUID
                }, data: {
                    TrackMessageId: messageData.Name,
                }
            })

        await interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} The invite logging message template has been updated successfully.`,
        })
    }
};
