import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

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
            const allEmbeds = await database.vanitys
                .findMany({
                    where: {
                        UserId: interaction.user.id
                    }
                })

            if (!client.user) throw new Error("Client is not ready");

            if (!allEmbeds.length) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} You don't have any vanity URL's`,
                    flags: MessageFlags.Ephemeral
                });
            }

            const embedsList = allEmbeds.slice(currentIndex, currentIndex + pageSize);
            const embedMessages = await Promise.all(
                embedsList.map(async (embed) => {
                    return new EmbedBuilder()
                        .setColor("#2B2D31")
                        .setDescription(
                            [
                                `**Vanity**: \`${embed.Slug}\``,
                                `**Host**: \`${embed.Host}\``,
                                `**Guild**: ${await client.guilds.fetch(embed?.GuildId as string).then(g => g.name)} (\`${embed?.GuildId}\`)`,
                                `**Invite**: [Invite](${embed.Invite})`,
                                `**vanity-Link**: [vanity Link](https://dchat.click/${embed.Slug})`,
                                `**UUID**: \`\`\`${embed.UUID}\`\`\``
                            ].join("\n")
                        );
                })
            );

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("vanity-manage-select")
                .setPlaceholder("Select a Option to manage")
                .addOptions(
                    embedsList.map((embed) => ({
                        label: `${embed.Slug} - ${embed.Host}`,
                        description: `UUID: ${embed.UUID}`,
                        value: embed.UUID,
                        emoji: "<:link:1321941111090057248>"
                    })) as any
                );

            const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:arrowbackregular24:1301119279088799815>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`vanity-manage:${uuid}:${currentIndex - pageSize}`)
                    .setDisabled(currentIndex === 0),
                new ButtonBuilder()
                    .setEmoji("<:next:1287457822526935090>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`vanity-manage:${uuid}:${currentIndex + pageSize}`)
                    .setDisabled(currentIndex + pageSize >= allEmbeds.length)
            );

            const selectMenuRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    selectMenu
                );

            await interaction.update({
                withResponse: true,
                content: " ",
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
