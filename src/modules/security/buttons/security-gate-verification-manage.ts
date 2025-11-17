import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder, TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import {database} from "../../../main/database.js";
import {PaginationData} from "../../../types/Pagination.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verification-manage",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");

        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const guildId = interaction.guild?.id;
        const pageSize = 5;

        const data = await database.verificationGates
            .findMany({
                where: {
                    SecurityId: guildId
                }
            })

        if (!data?.length) {
            if (!client.user) throw new Error("Client User is not defined");
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No Button Found`, interaction, true, "reply")
        }

        function formatEnum(value?: string): string {
            return value
                ? value
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "N/A";
        }

        const list = data.slice(currentIndex, currentIndex + pageSize);

        const selectMenuOptions = await Promise.all(
            list.map(async (embed) => {
                const channelName = await interaction.guild?.channels.fetch(embed.ChannelId as string)
                    .then(channel => channel?.name || "Unknown Channel")
                    .catch(() => "Unknown Channel");
                return {
                    label:
                        (formatEnum(embed.ActionType as string) || "N/A") +
                        " - " +
                        (formatEnum(embed.Action as string) || "N/A") +
                        " - #" +
                        channelName,
                    description: `UUID: ${embed.UUID}`,
                    value: embed.UUID as string,
                    emoji: "<:verify:1380658230094725171>"
                };
            })
        );

        const embedMessages = new TextDisplayBuilder()
            .setContent(
                (await Promise.all(list.map(async (l) => [
                    `**Message URL**: [Click Here](https://discord.com/channels/${interaction.guildId}/${l.ChannelId}/${l.MessageId})`,
                    `**Action**: ${formatEnum(l.Action as string)}`,
                    `**Action Type**: ${formatEnum(l.ActionType as string)}`,
                ].join("\n")))).join("\n\n")
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("security-gate-verification-manage-select")
            .setPlaceholder("Select a Option to manage")
            .addOptions(selectMenuOptions);

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
