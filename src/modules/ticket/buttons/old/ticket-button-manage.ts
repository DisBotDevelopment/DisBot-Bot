import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {database} from "../../../../main/database.js";

export default {
    id: "ticket-button-manage",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: ExtendedClient) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const guildId = interaction.guild?.id;
        const pageSize = 5;

        try {
            const allEmbeds = await database.ticketSetups
                .findMany({
                    where: {
                        GuildId: guildId
                    }
                })

            if (!allEmbeds.length) {
                return interaction.reply({
                    content: "## No Embeds Found",
                    flags: MessageFlags.Ephemeral
                });
            }

            const embedsList = allEmbeds.slice(currentIndex, currentIndex + pageSize);
            const embedMessages = embedsList.map((embed) => {
                return new EmbedBuilder()
                    .setColor("#2B2D31")
                    .setDescription(
                        [
                            `**TicketChannelName**: \`${embed.TicketChannelName}\``,
                            `**Handlers**: <@&${embed.Handlers}>`,
                            `**UUID**: \`\`\`${embed.CustomId}\`\`\``
                        ].join("\n")
                    );
            });

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("ticket-button-manage-select")
                .setPlaceholder("Select a Option to manage")
                .addOptions(
                    embedsList.map((embed) => ({
                        label: embed.TicketChannelName,
                        description: `UUID: ${embed.CustomId}`,
                        value: embed.CustomId
                    })) as any
                );

            const navigationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:arrowbackregular24:1301119279088799815>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(
                        `ticket-button-manage:${uuid}:${currentIndex - pageSize}`
                    )
                    .setDisabled(currentIndex === 0),
                new ButtonBuilder()
                    .setEmoji("<:next:1287457822526935090>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(
                        `ticket-button-manage:${uuid}:${currentIndex + pageSize}`
                    )
                    .setDisabled(currentIndex + pageSize >= allEmbeds.length)
            );

            const selectMenuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

            await interaction.update({
                embeds: embedMessages,
                components: [navigationRow, selectMenuRow]
            });
        } catch (error) {
            console.error("Error:", error);
            interaction.reply({
                content:
                    "## An error occurred while fetching the embeds. Please try again later",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
