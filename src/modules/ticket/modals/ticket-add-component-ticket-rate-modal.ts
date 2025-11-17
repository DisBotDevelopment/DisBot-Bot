import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-ticket-rate-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const limit = interaction.fields.getTextInputValue("limit");
        const messageUrl = interaction.fields.getTextInputValue("messageUrl").split("/")
        const message = interaction.fields.getTextInputValue("message")
        const uuid = interaction.customId.split(":")[1];

        if (limit.length >= 1) {

            if (message.length <= 1) {
                await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} You need a Message Template!`,
                })
            }
            if (messageUrl.length <= 1) {
                await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} You need a Message URL!`,
                })
            }
            
            const states = limit.split(",")

            for (const state of states) {
                try {
                    const num = Number.parseInt(state);
                } catch (e) {
                    await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiToPng("error")} Please use valid numbers seperated by a comma`,
                    })
                }
            }

        }

        let messageTemplate: string | null = null
        if (message.length >= 1) {
            const template = await database.messageTemplates.findFirst({
                where: {
                    Name: message
                }
            })

            if (!template) {
                await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} No Message Template found!`,
                })
            }

            messageTemplate = message

        }

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: uuid
                },
                data: {
                    TicketRateLimit: limit ?? null,
                    TicketStatusMessageTemplateId: messageTemplate,
                    TicketStatusMessageId: messageUrl[6],
                    TicketStatusChannelId: messageUrl[5]
                }
            }
        );

        await interaction.deferUpdate();
    }
};
