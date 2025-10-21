import {ButtonInteraction, MessageFlags, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "tag-create-save",

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

        if (!client.user) throw new Error("Client not found!");

        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "tag"
                )} The Tag does not exist anymore`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (!data.MessageTemplateId) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "tag"
                )} The Tag has no Message set`,
                flags: MessageFlags.Ephemeral
            });
        }

        interaction.update({
            content: `## ${await convertToEmojiToPng("tag")} Tag \`\`${data.TagId
            }\`\` saved! All Data validated`
        });
    }
};
