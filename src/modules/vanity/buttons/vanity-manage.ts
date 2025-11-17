import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {PaginationData} from "../../../types/Pagination.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-manage",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    execute: async function (interaction: ButtonInteraction, client: ExtendedClient) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 5;

        try {
            const data = await database.vanitys
                .findMany({
                    where: {
                        UserId: interaction.user.id
                    }
                })

            if (!client.user) throw new Error("Client is not ready");

            if (!data.length) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} You don't have any vanity URL's`, interaction, true)
            }

            const list = data.slice(currentIndex, currentIndex + 5)
            const embedMessages = new TextDisplayBuilder()
                .setContent(
                    (await Promise.all(list.map(async (l) => `**Vanity**: ${l.Host}/${l.Slug}\n**UUID**: ${l.UUID}`))
                    ).join("\n\n"))

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("vanity-manage-select")
                .setPlaceholder("Select a Option to manage")
                .addOptions(
                    await Promise.all(
                        data.map((l) => ({
                            label: `${l.Host}/${l.Slug}`,
                            description: `UUID: ${l.UUID}`,
                            value: l.UUID,
                            emoji: "<:link:1321941111090057248>"
                        })) as any
                    )
                );


            const paginationData: PaginationData = {
                interaction: interaction,
                paginationData: data,
                buttonCustomId: "backup-restore",
                selectmenu: selectMenu,
                content: embedMessages,
                pageSize: pageSize,
                client: client,
                currentIndex: currentIndex,
                latestUUID: uuid
            }

            await PaginationBuilder(
                paginationData
            )
        } catch (error) {
            console.error("Error:", error);
            interaction.reply({
                content:
                    "## An error occurred while fetching the buttons. Please try again later",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
