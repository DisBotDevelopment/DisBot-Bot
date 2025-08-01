import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    MessageFlags,
    UserSelectMenuInteraction
} from "discord.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-button-manage-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: Client) {
        for (const uuid of interaction.values) {
            const guildId = interaction.guild?.id;

            const nextEmbed = await database.ticketSetups.findFirst({
                where: {
                    GuildId: guildId,
                    CustomId: uuid
                }
            });
            if (!nextEmbed) {
                interaction.reply({
                    content: "## No Ticket Button Found",
                    flags: MessageFlags.Ephemeral
                });
            }

            const embedMessage = new EmbedBuilder()
                .setColor("#2B2D31")
                .setDescription(
                    [
                        `**Ticket Channel Name**: \`${nextEmbed.TicketChannelName}\``,
                        `**UUID**: \`\`\`${nextEmbed.CustomId}\`\`\``,
                        `**Online View: ** [Click Here](https://app.disbot.app/tickets/buttons/${nextEmbed.CustomId})`
                    ].join("\n")
                );

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:edit:1259961121075626066>")
                    .setLabel("Edit the Ticket Panel")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("ticket-button-manage-edit:" + nextEmbed.CustomId),
                new ButtonBuilder()
                    .setEmoji("<:trash:1259432932234367069>")
                    .setLabel("Delete the Ticket Panel")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("ticket-button-manage-delete:" + nextEmbed.CustomId)
            );
            await interaction.reply({
                embeds: [embedMessage],
                components: [row],
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
