import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-update-description-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client is not ready");
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const data = await database.vanitys.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        const newSlug = interaction.fields.getTextInputValue("vanity-update-description-input");

        if (!data) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} This vanity URL is not found.`,
            });
            return;
        }

        await database.vanityEmbeds.update({
            where: {
                VanityId: interaction.customId.split(":")[1]
            },
            data: {
                Description: newSlug
            }
        })

        await interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} The descriptionv of the vanity URL has been updated to \`${newSlug}\`.`,
        })

    }
};
