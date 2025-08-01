import {ButtonStyle, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

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
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} This vanity URL is not found.`,
            });
            return;
        }

        if (data.Slug === newSlug) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} The new slug is the same as the old one.`
            });
            return;
        }

        if (newSlug.length < 2) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} The slug must be between 3 and 32 characters long.`
            });
            return;
        }

        const isSlug = await database.vanitys.findFirst({
            where: {
                Slug: data.Slug
            }
        })

        if (isSlug) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} The slug \`${newSlug}\` is already in use. Please choose a different one.`
            });
            return;
        }

        await database.vanitys.update({
            where: {
                UUID: data.UUID
            },
            data: {
                Slug: newSlug
            }
        })

        await interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} The slug has been changed to \`${newSlug}\`.`
        });


    }
};
