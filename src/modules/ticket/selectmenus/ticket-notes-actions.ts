import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder,
    ChannelType,
    Client, ContainerBuilder, GuildMember,
    MessageFlags, ModalBuilder,
    RoleSelectMenuBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, TextInputBuilder, TextInputStyle,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-notes-actions",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        const uuid = interaction.customId.split(":")[1];
        const currentIndex = parseInt(interaction.customId.split(":")[2]);
        const data = await database.tickets.findFirst({
            where: {
                TicketId: uuid
            }
        })

        for (const value of interaction.values) {

            switch (value) {
                case "add-note": {

                    const lookBypass = (await hasTicketPermission("look_bypass", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client))

                    if (data.IsLocked && !lookBypass) return await ticketErrorMessage("Ticket is Locked", interaction, client)

                    const modal = new ModalBuilder()
                    const note = new TextInputBuilder()

                    modal
                        .setTitle("Add new note")
                        .setCustomId("notes-actions-add-note-modal:" + data.TicketId)
                        .addComponents(new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                note
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setLabel("Note")
                                    .setCustomId("note")
                                    .setPlaceholder("Write some text")
                                    .setMinLength(5)
                                    .setMaxLength(1000)
                                    .setRequired(true)
                            )
                        )
                    await interaction.showModal(modal)
                }
                    break;
                case "send-notes": {
                    const lookBypass = (await hasTicketPermission("look_bypass", interaction.member as GuildMember, data.TicketId, client) || await hasTicketPermission("all", interaction.member as GuildMember, data.TicketId, client))

                    if (data.IsLocked && !lookBypass) return await ticketErrorMessage("Ticket is Locked", interaction, client)

                    const list = data.TicketNotes.slice(currentIndex, currentIndex + 3);

                    await interaction.channel.send({
                        flags: MessageFlags.IsComponentsV2,
                        components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(
                            `${list.length > 0
                                ? list.map((l, idx) => `**#${idx + 1}**:\n> ${l}`).join("\n\n")
                                : "There are no notes for this ticket. Please create a note first!"}\n\n-# **Export by ${interaction.user} (${interaction.user.id})**`
                        ))
                        ]
                    })
                    await interaction.deferUpdate()

                }
                    break;
            }

        }
    }
}
