import {ButtonInteraction, ChannelType, MessageFlags, TextInputStyle,} from "discord.js";
import {database} from "../../../../main/database.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";

export default {
    id: "ticket-set-button-thread-button",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modalID = interaction.customId.split(":")[1];

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: interaction.customId.split(":")[1]
            }
        });
        if (!data.CategoryId) {
            if (!client.user?.id) throw new Error("Client user ID is not defined");
            return await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Please select the Channel to use as thread channel.`,
                flags: MessageFlags.Ephemeral,
            });
        }
        const channel = interaction.guild.channels.cache.get(data.CategoryId)
        if (channel.type != ChannelType.GuildText) {
            if (!client.user?.id) throw new Error("Client user ID is not defined");
            return await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} You can't use this command with an announcement channels`,
                flags: MessageFlags.Ephemeral,
            });
        }

    },
};
