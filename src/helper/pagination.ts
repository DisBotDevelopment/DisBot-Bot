import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder } from "discord.js";
import { convertToEmojiPng } from "./emojis.js";
import { PaginationData } from "../types/pagination.js";

export async function PaginationBuilder(data: PaginationData) {

    try {

        const currentIndex = data.currentIndex || 0;
        const uuid = data.latestUUID

        if (!data.paginationData.length) {
            if (!data.client.user) throw new Error("Client User is not defined");
            return data.interaction.reply({
                content: `## ${await convertToEmojiPng("error", data.client.user?.id)} No Button Found`,
                flags: MessageFlags.Ephemeral
            });
        }

        const message = data.content
        const selectMenu = data.selectmenu

        const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setEmoji("<:arrowbackregular24:1301119279088799815>")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`${data.buttonCustomId}:${uuid}:${currentIndex - data.pageSize}`)
                .setDisabled(currentIndex === 0),
            new ButtonBuilder()
                .setEmoji("<:next:1287457822526935090>")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`${data.buttonCustomId}:${uuid}:${currentIndex + data.pageSize}`)
                .setDisabled(currentIndex + data.pageSize >= data.paginationData.length)
        );

        const selectMenuRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                selectMenu
            );

        await data.interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(message).addActionRowComponents(
                        navigationRow
                    ).addActionRowComponents(selectMenuRow)]
        });
    } catch (error) {
        console.error("Error:", error);
        data.interaction.reply({
            content:
                "## An error occurred while fetching the buttons. Please try again later",
            flags: MessageFlags.Ephemeral
        });
    }
}