import {ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    id: "ticket-set-button-modal-close",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const message = await interaction.channel?.messages.fetch(
            interaction.message.id
        );

        const content = message?.content.split("|");
        if (!content) throw new Error("Invalid Content");

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: content[2]
            }
        });

        if (!client.user) throw new Error("Client User is not defined");


        interaction.update({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} Your Modal has been created!`,
        });
    }
};
