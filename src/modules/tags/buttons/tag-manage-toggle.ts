import {ButtonInteraction, MessageFlags, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "tag-manage-toggle",

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

        if (!client.user) throw new Error("Client not found");

        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "tag"
                )} This tag does not exist`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (data.IsEnabled == true) {
            await database.tags.update(
                {
                    where: {UUID: UUID}, data: {IsEnabled: false}
                }
            );

            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "toggleoff"
                )} The tag has been disabled`,
                flags: MessageFlags.Ephemeral
            });
        } else {
            await database.tags.update(
                {
                    where: {UUID: UUID}, data: {IsEnabled: true}
                }
            );
            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "toggleon"
                )} The tag has been enabled`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
