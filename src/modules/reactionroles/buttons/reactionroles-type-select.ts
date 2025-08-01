import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-type-select",

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
        const label = new TextInputBuilder();
        const emoji = new TextInputBuilder();
        const description = new TextInputBuilder();
        const placeholder = new TextInputBuilder();

        modal
            .setTitle("Select Reaction Role Type")
            .setCustomId("reactionroles-type-select-modal:" + uuid);

        label
            .setCustomId("reactionroles-type-select-label")
            .setPlaceholder("Provide a label for the select menu")
            .setLabel("Label")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        emoji
            .setCustomId("reactionroles-type-select-emoji")
            .setPlaceholder("Provide an emoji for the select menu")
            .setLabel("Emoji")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        description
            .setCustomId("reactionroles-type-select-description")
            .setPlaceholder("Describe the role?")
            .setLabel("Description")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        placeholder
            .setCustomId("reactionroles-type-select-placeholder")
            .setPlaceholder("Provide a placeholder for the select menu")
            .setLabel("Placeholder")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(label),
            new ActionRowBuilder<TextInputBuilder>().addComponents(emoji),
            new ActionRowBuilder<TextInputBuilder>().addComponents(description),
            new ActionRowBuilder<TextInputBuilder>().addComponents(placeholder)
        );

        interaction.showModal(modal);
    }
};
