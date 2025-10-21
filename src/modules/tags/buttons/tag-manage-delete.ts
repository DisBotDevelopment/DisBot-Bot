import {ButtonInteraction, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "tag-manage-delete",

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
            return interaction.update({
                content: `## ${await convertToEmojiToPng(
                    "tag"
                )} No tag found.`,
                embeds: [],
                components: []
            });
        }

        await database.tags.delete({
            where: {UUID: UUID}
        });

        await interaction.update({
            content: `## ${await convertToEmojiToPng("tag")} The tag ${data.TagId
            } has been deleted.`,
            embeds: [],
            components: []
        });
    }
};
