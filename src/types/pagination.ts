import { ButtonInteraction, StringSelectMenuBuilder, TextDisplayBuilder } from "discord.js";
import { ExtendedClient } from "./client.js";

export interface PaginationData {
    interaction: ButtonInteraction,
    paginationData: any,
    pageSize: 5,
    buttonCustomId: string,
    selectmenu: StringSelectMenuBuilder,
    content: TextDisplayBuilder,
    client: ExtendedClient
    currentIndex: number
    latestUUID: string
}