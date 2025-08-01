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
    id: "ticket-button-update-select",

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
                    CustomId: uuid.split(":")[0]
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
                        `**Handlers**: <@&${nextEmbed.Handlers}>`,
                        `**UUID**: \`\`\`${nextEmbed.CustomId}\`\`\``
                    ].join("\n")
                );

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:send:1288224549078434012>")
                    .setLabel("Update Ticket Panel")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(
                        "bticket-update:" + nextEmbed.CustomId + ":" + uuid.split(":")[1]
                    )
            );
            await interaction.reply({
                embeds: [embedMessage],
                components: [row],
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
