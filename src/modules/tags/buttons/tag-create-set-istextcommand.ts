import {ButtonInteraction, MessageFlags, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "tag-create-set-istextcommand",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const UUID = interaction.customId.split(":")[1];

        const data = await database.tags.findFirst({
            where: {
                UUID: UUID
            }
        });

        if (!client.user) throw new Error("Client not Found!");

        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} The Tag does not exist.`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (data.IsTextInputCommand == false) {
            await database.tags.update(
                {
                    where: {
                        UUID: UUID
                    },
                    data: {
                        IsTextInputCommand: true
                    }
                }
            );

            interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "tag",
                    client.user.id
                )} The Tag is now a Text Input Command. Use !${data.TagId}`,
                flags: MessageFlags.Ephemeral
            });
        } else {
            await database.tags.update(
                {
                    where: {
                        UUID: UUID
                    },
                    data: {
                        IsTextInputCommand: false
                    }
                }
            );

            interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "tag",
                    client.user.id
                )} This tag is no longer a TextInputCommand.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
