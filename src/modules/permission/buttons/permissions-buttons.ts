import {ButtonInteraction, ChannelType, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";

export default {
    id: "permissions-buttons",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 5;
        const data = client.buttons.map(value => value)

        if (data.length <= 0) return interaction.reply({
            content: "No buttons found.",
            flags: MessageFlags.Ephemeral
        });

        const list = data.slice(currentIndex, currentIndex + 5);
        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => `**Button Name:** ${l.interactionName ?? "N/A"}${l.interactionDescription ? `\n**Description:** ${l.interactionDescription ?? "N/A"}` : ""}\n**CustomId:** ${l.id}`))).join("\n\n")
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("permissions-buttons-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(
                await Promise.all(list.map(async (l) => ({
                    label: `${l.interactionName ?? "N/A"} (${l.id})`,
                    description: `CustomId: ${l.id}`,
                    value: l.id,
                    emoji: "<:button:1327305176553492520>",
                })) as any)
            );

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "permissions-buttons",
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

    }
};
