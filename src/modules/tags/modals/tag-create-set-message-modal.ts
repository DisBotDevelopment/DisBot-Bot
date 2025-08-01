import { ButtonStyle, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

export default {
    id: "tag-create-set-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const UUID = interaction.customId.split(":")[1];

        const data = await database.tags.findFirst({
            where: {
                UUID: UUID
            }
        });

        if (!client.user) throw new Error("Client user is not cached");

        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "tag",
                    client.user.id
                )} The tag dose not exists!`,
                flags: MessageFlags.Ephemeral
            });
        }

        const messageData = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.fields.getTextInputValue(
                    "tag-create-set-message-input-id"
                )
            }
        });

        if (!messageData) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "tag",
                    client.user.id
                )} The MessageID with the name \`${interaction.fields.getTextInputValue(
                    "tag-create-set-message-input-id"
                )}\` not exists.`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.tags.update(
            {
                where: {
                    UUID: UUID
                },
                data: {
                    MessageId: interaction.fields.getTextInputValue(
                        "tag-create-set-message-input-id"
                    )
                }
            }
        );

        interaction.reply({
            content: `## ${await convertToEmojiPng(
                "tag",
                client.user.id
            )} The MessageID with the ID \`${interaction.fields.getTextInputValue(
                "tag-create-set-message-input-id"
            )}\` has been set for the Tag`,
            flags: MessageFlags.Ephemeral
        });
    }
};
