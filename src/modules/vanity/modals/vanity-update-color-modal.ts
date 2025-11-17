import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-update-color-modal",

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

        const data = await database.vanityEmbed.findFirst({
            where: {
                VanityId: interaction.customId.split(":")[1]
            }
        });


        const newSlug = interaction.fields.getTextInputValue("vanity-update-color-input");

        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This vanity URL is not found.`, interaction, true, "deferReply")
        }

        if (!newSlug || newSlug.length < 3 || newSlug.length > 7) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The color must be between 3 and 7 characters long.`, interaction, true, "deferReply")
        }

        if (!newSlug.includes("#")) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The color must start with a \`#\` character.`, interaction, true, "deferReply")
        }

        await database.vanityEmbed.update({
            where: {
                Id: data.Id,
            },
            data: {
                Title: newSlug
            }
        })

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} The color of the vanity URL has been updated to \`${newSlug}\`.`, interaction, true, "deferReply")
    }
};
