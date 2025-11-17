import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-update-image-modal",

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


        const newSlug = interaction.fields.getTextInputValue("vanity-update-image-thumbnail-input");
        const newImage = interaction.fields.getTextInputValue("vanity-update-image-image-input");

        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This vanity URL is not found.`, interaction, true, "deferReply")
        }


        await database.vanityEmbed.update({
            where: {
                Id: data.Id,
            },
            data: {
                ThumbnailUrl: newSlug,
                ImageUrl: newImage
            }
        })

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} The image and thumbnail of the vanity URL have been updated.`, interaction, true, "deferReply")
    }
};
