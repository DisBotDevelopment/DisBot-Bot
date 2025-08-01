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
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "tag-manage",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const allEmbeds = await database.tags.findMany({
            where: {
                GuildId: interaction.guild?.id
            }
        })

        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr, 10) || 0;

        try {
            const pageSize = 5;
            if (!allEmbeds.length) {
                return interaction.reply({
                    content: "## No menu found",
                    flags: MessageFlags.Ephemeral
                });
            }

            const embedsList = allEmbeds.slice(currentIndex, currentIndex + pageSize);

            const embedMessages = embedsList.map((embed) => {
                return new EmbedBuilder()
                    .setColor("#2B2D31")
                    .setDescription(
                        [
                            `## ${embed.TagId}`,
                            ``,
                            `> **UUID:** \`${embed.UUID}\``,
                            `> **Tag Name:** \`${embed.TagId}\``,
                            `> **Tag Message:** \`${embed.MessageId || `No Message`}\``,
                            `> **TextCommand:** \`${embed.IsTextInputCommand ? "Yes" : "No"
                            }\``,
                            `> **SlashCommand:** \`${embed.IsShlashCommand ? "Yes" : "No"}\``,
                            `> **Enabled:** \`${embed.IsEnabled ? "Yes" : "No"}\``,
                            `> **Permission Role:** ${embed.PermissionRoleId
                                ? `<@&${embed.PermissionRoleId}>`
                                : `\`\`\No Permission\`\``
                            }`
                        ].join("\n")
                    );
            });

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("tag-manage-select")
                .setPlaceholder("Select a Option to manage")
                .addOptions(
                    embedsList.map((embed) => ({
                        label: `${embed.TagId}`,
                        description: `UUID: ${embed.UUID}`,
                        value: embed.UUID,
                        emoji: "<:tag:1320069058179235850>"
                    })) as any
                );

            const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:arrowbackregular24:1301119279088799815>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`tag-manage:${uuid}:${currentIndex - pageSize}`)
                    .setDisabled(currentIndex === 0),
                new ButtonBuilder()
                    .setEmoji("<:next:1287457822526935090>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`tag-manage:${uuid}:${currentIndex + pageSize}`)
                    .setDisabled(currentIndex + pageSize >= allEmbeds.length)
            );

            const selectMenuRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    selectMenu
                );

            await interaction.update({
                embeds: embedMessages,
                components: [navigationRow, selectMenuRow]
            });
        } catch (error) {
            console.error("Error:", error);
            await interaction.reply({
                content:
                    "## An error occurred while fetching the menus. Please try again later.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
