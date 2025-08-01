import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder,
    TextInputStyle
} from "discord.js";
import {database} from "../../../main/database.js";

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

        try {
            const allEmbeds = await database.verificationGates
                .findMany({
                    where: {
                        SecurityId: guildId
                    }
                })

            if (!allEmbeds?.length) {
                if (!client.user) throw new Error("Client User is not defined");
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} No Button Found`,
                    flags: MessageFlags.Ephemeral
                });
            }

            function formatEnum(value?: string): string {
                return value
                    ? value
                        .split("_")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                    : "N/A";
            }

            const embedsList = allEmbeds.slice(currentIndex, currentIndex + pageSize);
            const embedMessages = embedsList.map((embed) => {
                return new EmbedBuilder()
                    .setColor("#2B2D31")
                    .setDescription(
                        [
                            `**Message URL**: [Click Here](https://discord.com/channels/${interaction.guildId}/${embed.ChannelId}/${embed.MessageId})`,
                            `**Action**: ${formatEnum(embed.Action as string)}`,
                            `**Action Type**: ${formatEnum(embed.ActionType as string)}`,
                        ].join("\n")
                    );
            });

            const selectMenuOptions = await Promise.all(
                embedsList.map(async (embed) => {
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

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("security-gate-verification-manage-select")
                .setPlaceholder("Select a Option to manage")
                .addOptions(selectMenuOptions as any);

            const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:arrowbackregular24:1301119279088799815>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`security-gate-verification-manage:${uuid}:${currentIndex - pageSize}`)
                    .setDisabled(currentIndex === 0),
                new ButtonBuilder()
                    .setEmoji("<:next:1287457822526935090>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`security-gate-verification-manage:${uuid}:${currentIndex + pageSize}`)
                    .setDisabled(currentIndex + pageSize >= allEmbeds.length)
            );

            const selectMenuRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    await selectMenu
                );

            await interaction.update({
                embeds: embedMessages,
                components: [navigationRow, selectMenuRow]
            });
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
