import {ButtonInteraction, MessageFlags} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
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


        const data = await database.autoDeletes.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!data) {
            await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No AutoDelete setup found with UUID: \`${interaction.customId.split(":")[1]}\``,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const uuid = data.UUID || interaction.customId.split(":")[1];
        const isActive = data.IsActive;
        const newStatus = !isActive;
        await database.autoDeletes.update(
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
            content: `## ${await convertToEmojiPng(newStatus ? "check" : "error", client.user?.id)} AutoDelete setup is now ${newStatus ? "activated" : "deactivated"}!`,
            flags: MessageFlags.Ephemeral
        });


    }
};
