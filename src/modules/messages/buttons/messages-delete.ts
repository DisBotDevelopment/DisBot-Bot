import {ChannelType, MessageFlags, UserSelectMenuInteraction,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-delete",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const data = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.customId.split(":")[1],
            }
        });

        if (!client.user) throw new Error("Client not Found");
        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} The message you are trying to delete does not exist.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.messageTemplates.deleteMany({
            where: {
                Name: interaction.customId.split(":")[1],
            }
        });

        if (!client.user) throw new Error("Client not Found");
        interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Message Template Deleted (ID:  
        ${interaction.customId.split(":")[1]})`,
        }).then(() => {
            setTimeout(() => {
                interaction.deleteReply().catch(() => {
                });
            }, 5000);
        })
    },
};
