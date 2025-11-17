import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-change-slug-modal",

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

        const newSlug = interaction.fields.getTextInputValue("vanity-change-slug-input");

        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This vanity URL is not found.`, interaction, true, "deferReply");
        }

        if (data.Slug == newSlug) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The new slug is the same as the old one.`, interaction, true, "deferReply");
        }

        if (newSlug.length < 2) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The slug must be between 3 and 32 characters long.`, interaction, true, "deferReply");
        }

        const isSlug = await database.vanitys.findFirst({
            where: {
                Slug: newSlug
            }
        })

        if (isSlug) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The slug \`${newSlug}\` is already in use. Please choose a different one.`, interaction, true, "deferReply");
        }

        await database.vanitys.update({
            where: {
                UUID: data.UUID
            },
            data: {
                Slug: newSlug
            }
        })

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} The slug has been changed to \`${newSlug}\`.`, interaction, true, "deferReply");
    }
};
