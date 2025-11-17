import {ButtonStyle, ChannelType, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-components-create-save",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];
        const message = await interaction.channel?.messages.fetch(interaction.customId.split(":")[2]);
        if (!message) {
            return interaction.reply({
                content: "Message not found.",
                flags: MessageFlags.Ephemeral
            });
        }

        await database.messageTemplates.update(
            {
                where: {
                    Name: uuid
                },
                data: {
                    ComponentJSON: JSON.stringify(message?.components)
                }
            }
        );

        if (!client.user) throw new Error("Client not found!");
        await interaction
            .reply({
                content: `## ${await convertToEmojiToPng(
                    "check"
                )} The Component has been saved.\n-# You also can edit but note that you need to save it again.`,
                flags: MessageFlags.Ephemeral
            })
            .then(async () => {
                setTimeout(async () => {
                    await interaction.deleteReply();
                }, 5000);
            });
    }
};
