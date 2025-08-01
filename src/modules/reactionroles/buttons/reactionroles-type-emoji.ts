import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-type-emoji",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];

        const data = await database.reactionRoles.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (
            data?.Button?.Label ||
            data?.SelectMenu?.Label ||
            data?.Emoji
        ) {
            if (!client.user) throw new Error("Client user is not cached");
            return interaction.update({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} You have already set a type for this reaction role`,
                components: []
            });
        }

        const modal = new ModalBuilder();
        const emoji = new TextInputBuilder();

        modal
            .setTitle("Select Reaction Role Type")
            .setCustomId("reactionroles-type-emoji-modal:" + uuid);

        emoji
            .setCustomId("reactionroles-types-emoji-emoji")
            .setPlaceholder("Provide an emoji to listen for reactions")
            .setLabel("Emoji")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(emoji)
        );

        interaction.showModal(modal);
    }
};
