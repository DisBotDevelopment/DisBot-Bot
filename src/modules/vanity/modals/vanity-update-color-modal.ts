import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

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
            await interaction.editReply({
                content: `## ${await convertToEmojiToPng("error")} This vanity URL is not found.`,
            });
            return;
        }

        if (!newSlug || newSlug.length < 3 || newSlug.length > 7) {
            await interaction.editReply({
                content: `## ${await convertToEmojiToPng("error")} The color must be between 3 and 7 characters long.`,
            });
            return;
        }

        if (!newSlug.includes("#")) {
            await interaction.editReply({
                content: `## ${await convertToEmojiToPng("error")} The color must start with a \`#\` character.`,
            });
            return;
        }

        await database.vanityEmbed.update({
            where: {
                Id: data.Id,
            },
            data: {
                Title: newSlug
            }
        })

        await interaction.editReply({
            content: `## ${await convertToEmojiToPng("check")} The color of the vanity URL has been updated to \`${newSlug}\`.`,
        })

    }
};
