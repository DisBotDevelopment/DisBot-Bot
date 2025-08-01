import {ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-delete",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const data = await database.vanitys.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!client.user) throw new Error("Client is not ready");

        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("info", client.user.id)} This vanity URL is not found.`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.vanitys.deleteMany({
            where: {
                UUID: data.UUID
            }
        });

        return interaction.update({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Vanity URL has been deleted.`,
            components: [],
            embeds: []
        });
    }
};
