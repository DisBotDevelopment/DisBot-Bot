import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ChannelType,
    ContainerBuilder,
    GuildMember,
    MessageFlags, PermissionsBitField, SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize, StringSelectMenuBuilder,
    TextDisplayBuilder, ThumbnailBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";
import {PaginationData} from "../../../types/Pagination.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";

export default {
    id: "ticket-notes",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const [action, uuid, currentIndexStr] = interaction.customId.split(":");
        const currentIndex = parseInt(currentIndexStr) || 0;
        const pageSize = 3;

        console.log(uuid)

        const data = await database.tickets.findFirst({
            where: {
                TicketId: uuid
            }
        });

        if (!data) {
            return ticketErrorMessage("No Ticket found", interaction, client);
        }

        const list = data.TicketNotes.slice(currentIndex, currentIndex + pageSize);

        const embedMessages = new TextDisplayBuilder().setContent(
            data.TicketNotes.length > 0
                ? list.map((l, idx) => `**#${currentIndex + idx + 1}**:\n> ${l}`).join("\n\n")
                : "There are no notes for this ticket. Please create a note first!"
        );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("ticket-notes-select")
            .setDisabled(!(await hasTicketPermission("notes_delete", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client)))
            .setPlaceholder("Select a Note to Delete");

        if (data.TicketNotes.length > 0) {
            selectMenu.addOptions(
                list.map((l, num) => ({
                    label: (l || "N/A").slice(0, 100),
                    description: `Select to delete - Ticket ID: ${data.TicketId}`.slice(0, 100),
                    value: `${num}:${uuid}`.slice(0, 100),
                    emoji: "<:notebook:1402343486833033317>",
                }))
            );
        } else {
            selectMenu.addOptions([
                {
                    label: "N/A",
                    description: "N/A - No Notes found",
                    value: "error",
                    emoji: "<:notebook:1402343486833033317>",
                },
            ]);
        }

        const paginationData: PaginationData = {
                interaction: interaction,
                paginationData: data,
                buttonCustomId: "ticket-notes",
                selectmenu: selectMenu,
                content: embedMessages,
                pageSize: pageSize,
                client: client,
                currentIndex: currentIndex,
                latestUUID: uuid,
                extraComponents: new StringSelectMenuBuilder()
                    .setCustomId("ticket-notes-actions:" + uuid + ":" + currentIndex.toString())
                    .setPlaceholder("Select an Action")
                    .setDisabled(!(await hasTicketPermission("notes_actions", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client)))
                    .addOptions([
                        {
                            label: "Add Note",
                            description: "Create a note to the list",
                            emoji: ":addchannel:1324458759589728387>",
                            value: "add-note"
                        },
                        {
                            label: "Send Notes in Channel",
                            description: "Send the notes in this Channel",
                            emoji: "<:message:1322252985702551767>",
                            value: "send-notes"
                        }
                    ])
            }
        ;

        await PaginationBuilder(paginationData);
    }
}