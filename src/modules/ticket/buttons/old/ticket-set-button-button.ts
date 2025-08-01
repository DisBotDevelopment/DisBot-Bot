import {ButtonInteraction, ComponentType, MessageFlags,} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    id: "ticket-set-button-button",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        })
        const message = await interaction.channel?.messages.fetch(
            interaction.message.id
        );

        const content = message?.content.split("|");

        if (!content) throw new Error("Content is not defined!");

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: content[2],
            }
        });
        if (!client.user) throw new Error("Client is not defined!");

        if (!data?.TicketChannelName) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} You need to setup a channel name!`,
            });
        }
        if (!data.CategoryId) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} Please set a category first!`,
            });
        }

        if (!data.Handlers) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} There are no handlers setup.`,
            });
        }
        await interaction.editReply({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} The component has been created successfully!`,
            embeds: [],
            components: [],
        });
    },
};
