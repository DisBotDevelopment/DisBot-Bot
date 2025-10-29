import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-update-author-modal",

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

        const data = await database.vanityEmbedAuthor.findFirst({
            where: {
                VanityEmbedsId: interaction.customId.split(":")[1]
            }
        });


        const newSlug = interaction.fields.getTextInputValue("vanity-update-author-input");
        const icon = interaction.fields.getTextInputValue("vanity-update-author-icon-input");
        const newImage = interaction.fields.getTextInputValue("vanity-update-author-url-input");

        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This vanity URL is not found.`, interaction, true, "deferReply")
        }

        await database.vanityEmbedAuthor.update({
                where: {
                    Id: data.Id,
                },
                data: {
                    Name: newSlug,
                    IconURL: icon,
                    URL: newImage
                }
            }
        )

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} The author of the vanity URL has been updated to \`${newSlug}\`.`, interaction, true, "deferReply")
    }
};
