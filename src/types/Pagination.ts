import {
    ButtonBuilder,
    ButtonInteraction, ChannelSelectMenuBuilder, RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    TextDisplayBuilder, UserSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "./ExtendedClient.js";

export interface PaginationData {
    interaction: ButtonInteraction,
    paginationData: any,
    pageSize: 5 | number,
    buttonCustomId: string,
    selectmenu: StringSelectMenuBuilder,
    content: TextDisplayBuilder,
    client: ExtendedClient
    currentIndex: number
    latestUUID: string
    extraComponents?: ButtonBuilder | StringSelectMenuBuilder | UserSelectMenuBuilder | ChannelSelectMenuBuilder | RoleSelectMenuBuilder
}