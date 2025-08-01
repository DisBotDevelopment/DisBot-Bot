import {
    ActionRowBuilder,
    ButtonInteraction,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-type-button",

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
                components: [],
            });
        }

        const modal = new ModalBuilder();
        const label = new TextInputBuilder();
        const emoji = new TextInputBuilder();
        const style = new TextInputBuilder();

        modal
            .setTitle("Select Reaction Role Type")
            .setCustomId("reactionroles-type-button-modal:" + uuid);

        label
            .setCustomId("reactionroles-type-button-label")
            .setPlaceholder("Provide a label for the button")
            .setLabel("Label")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        emoji
            .setCustomId("reactionroles-type-button-emoji")
            .setPlaceholder("Provide an emoji for the button")
            .setLabel("Emoji")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        style
            .setCustomId("reactionroles-type-button-style")
            .setPlaceholder("Danger, Primary, Secondary, Success")
            .setLabel("Style")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(label),
            new ActionRowBuilder<TextInputBuilder>().addComponents(emoji),
            new ActionRowBuilder<TextInputBuilder>().addComponents(style)
        );

        interaction.showModal(modal);
    }
};
