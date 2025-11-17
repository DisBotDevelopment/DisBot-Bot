import {ButtonInteraction, MessageFlags} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "autodelete-toggle",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not cached.");


        const data = await database.guildAutoDeletes.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!data) {
            await interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} No AutoDelete setup found with UUID: \`${interaction.customId.split(":")[1]}\``,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const uuid = data.UUID || interaction.customId.split(":")[1];
        const isActive = data.IsActive;
        const newStatus = !isActive;
        await database.guildAutoDeletes.update(
            {
                where: {
                    UUID: uuid
                },
                data: {
                    IsActive: newStatus,
                }
            },
        );

        await interaction.reply({
            content: `## ${await convertToEmojiToPng(newStatus ? "check" : "error")} AutoDelete setup is now ${newStatus ? "activated" : "deactivated"}!`,
            flags: MessageFlags.Ephemeral
        });


    }
};
