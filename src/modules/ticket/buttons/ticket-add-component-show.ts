import {
    ActionRowBuilder,
    ButtonInteraction, ChannelType,
    ContainerBuilder,
    MessageFlags,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-show",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const customId = interaction.customId.split(":")[1];

        const data = await database.ticketSetups.findFirst({
            where: {CustomId: customId},
            include: {
                ModalOptions: true,
                TicketPermissions: true,
            },
        });

        if (!data) {
            await interaction.reply({
                content: "Kein Ticket-Setup mit dieser ID gefunden.",
                ephemeral: true,
            });
            return;
        }
        const ticketEmoji = await convertToEmojiToPng("ticket");

        const content = [
            `## ${ticketEmoji} Preview of Ticket Component \`${data.CustomId.substring(0, 10)}...\``,
            ``,
            `**Channel Name **_*_**:** ${data.TicketChannelName ?? "_No Name_"}`,
            `**Channel Type **_*_**:** ${data.ChannelType == ChannelType.GuildCategory ? "Category" : "Thread"}`,
            `**Ticket Permissions **_*_**: \`Use the Button from the \"Ticket-Permissions-Button\"\``,
            `**Ticket Limit:** ${data.TicketLimit ?? "_No Limit_"}`,
            `**Only Claim Mode:** ${data.OnlyClaimMode ? "Yes" : "No"}`,
            `**Has Modal:** ${data.HasModal ? "Yes" : "No"}`,
            `**Modal Title:** ${data.ModalTitle ?? "_N/A_"}`,
            `**Modal Options:** ${data.ModalOptions.length > 0 ? data.ModalOptions.map(m => m.Name).join(", ") : "_N/A_"}`,
            `**Auto Close Actions:** ${data.AutoCloseAction?.length ? data.AutoCloseAction.join(", ") : "_N/A_"}`,
            `**Required Roles:** ${data.RequiredRoles?.length ? data.RequiredRoles.join(", ") : "_N/A_"}`,
            `**Ticket Creation Cooldown (s):** ${data.TicketCreationCooldownPerUser ?? "_N/A_"}`,
            `**With Ticket Feedback:** ${data.WithTicketFeedback ? "Yes" : "No"}`,
            `**Send Transcript To User:** ${data.SendTranscriptToUser ? "Yes" : "No"}`,
            `**Auto Close After Inactivity (ms):** ${data.AutoCloseAfterInactivity ?? "_N/A_"}`,
            `**Auto Close After Time (ms):** ${data.AutoCloseAfterTime ?? "_N/A_"}`,
            `**Auto Assign Handler:** ${data.AutoAssignHandler ?? "_N/A_"}`,
            `**Ticket Blacklist Roles:** ${data.TicketBlacklistRoles?.length ? data.TicketBlacklistRoles.join(", ") : "_N/A_"}`,
            `**Transcript Channel:** ${data.TranscriptChannelId ?? "_N/A_"}`,
            `**Ticket Feedback Channel:** ${data.TicketFeedbackChannelId ?? "_N/A_"}`,
            `**Old Ticket Category:** ${data.OldTicketCategoryId ?? "_N/A_"}`,
            `**Enable Tickets Only From Time:** ${data.EnableTicketsOnlyFromTime ?? "_N/A_"}`,
            `**Category ID:** \`${data.CategoryId ?? "N/A"}\``,
            `**Message Template ID:** ${data.MessageTemplateId ?? "_N/A_"}`,
            `**User DM When Close Message Template ID:** ${data.UserDMWhenCloseMessageTemplateId ?? "_N/A_"}`,
            `**Auto Reply Message Template ID:** ${data.AutoReplyMessageTemplateId ?? "_N/A_"}`,
            `**Slash Command ID:** \`${data.SlashCommandId ?? "N/A"}\``,
            `**Text Command Name:** ${data.TextCommandName ?? "_N/A_"}`,
            ``,
            `${await convertToEmojiToPng("info")} Options with _*_ is a Required Option!`,
            ``,
        ].join("\n");

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(content)
                ),
            ],
        });
    },
};
