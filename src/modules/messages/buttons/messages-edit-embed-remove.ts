import {ButtonStyle, MessageFlags, UserSelectMenuInteraction,} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-edit-embed-remove",

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

        if (data?.EmbedJSON && data?.Content == null) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "error"
                )} You can't remove the embed of a message that has no content.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.messageTemplates.update(
            {
                where: {
                    Name: interaction.customId.split(":")[1],
                },
                data: {
                    EmbedJSON: null,
                }
            }
        );

        interaction
            .reply({
                content: `## ${await convertToEmojiToPng(
                    "check"
                )} The embed of the message has been removed.`,
                flags: MessageFlags.Ephemeral,
            })
            .then(async () => {
                setTimeout(() => {
                    interaction.deleteReply();
                }, 2000);
            });
    },
};
