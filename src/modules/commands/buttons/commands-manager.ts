import {ButtonInteraction, ChannelType, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";

export default {
    id: "commands-manager",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 5;
        const data = client.commands.map(value => value)

        if (data.length <= 0) return interaction.reply({
            content: "No commands found.",
            flags: MessageFlags.Ephemeral
        });

        const list = data.slice(currentIndex, currentIndex + 5);
        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => `**Slash Command Name:** ${l.data.name}\n**Slash Command Description**: ${l.data.description}`))).join("\n\n")
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("commands-manager-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(
                await Promise.all(list.map(async (l) => ({
                    label: `${l.data.name}`,
                    description: `${l.data.description ?? "N/A"}`,
                    value: l.data.name,
                    emoji: "<:terminal:1260322426323996783>",
                })) as any)
            );

        const paginationData: PaginationData = {
            interaction: interaction,
            paginationData: data,
            buttonCustomId: "commands-manager",
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
