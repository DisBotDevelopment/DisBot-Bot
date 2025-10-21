import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    GuildMember,
    MessageFlags, PermissionsBitField, SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder, ThumbnailBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {handleCloseAction, hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-infos",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1]
        const data = await database.tickets.findFirst({
            include: {
                TicketSetup: {
                    include: {
                        TicketPermissions: true
                    }
                }
            },
            where: {
                TicketId: uuid
            }
        })

        if (!data) {
            return ticketErrorMessage("No Ticket found", interaction, client)
        }

        const member = interaction.guild.members.cache.get(data.TicketOwnerId);
        const user = member?.user;

        await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("ticket")} Ticket Infos of ${interaction.channel.name}`,
                                    `> **Ticket ID**: ${data.TicketId}`,
                                    `> **Claimed**: ${data.IsClaimed ? "Yes" : "No"}`,
                                    `> **User Claimed**: ${data.UserWhoHasClaimedId ? `<@${data.UserWhoHasClaimedId}>` : "N/A"}`,
                                    `> **Created At**: <t:${Math.floor(new Date(data.CreatedAt).getTime() / 1000)}:R> (<t:${Math.floor(new Date(data.CreatedAt).getTime() / 1000)}>)`,
                                    `> **Closed**: ${data.IsClosed ? "Yes" : "No"}`,
                                    `> **Closed At**: ${data.ClosedAt ? `<t:${Math.floor(new Date(data.ClosedAt).getTime() / 1000)}` : `N/A`}`,
                                    `> **Locked**: ${data.IsLocked ? "Yes" : "No"}`,
                                    `> **Archived**: ${data.IsArchived ? "Yes" : "No"}`,
                                    `> **Ticket Owner**: <@${data.TicketOwnerId}>`,
                                ].join("\n")
                            )
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
                    )
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent([
                                        `## ${await convertToEmojiToPng("uservoice")} Infos of ${member}`,
                                        ``,
                                        `> **Username:** \`${user?.tag || "Unknown"}\``,
                                        `> **User ID:** \`${user?.id || "Unknown"}\``,
                                        `> **Mention:** <@${user?.id || "Unknown"}>`,
                                        `> **Account Created:** ${user?.createdAt ? `<t:${Math.floor(user.createdAt.getTime() / 1000)}:F>` : "N/A"}`,
                                        `> **Joined Server:** ${member?.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F>` : "N/A"}`,
                                        `> **Nickname:** \`${member?.nickname || "None"}\``,
                                        `> **Avatar:** [Click here](${user?.displayAvatarURL()})`
                                    ].join("\n"))
                            ).setThumbnailAccessory(
                            new ThumbnailBuilder().setURL(interaction.guild.members.cache.get(data.TicketOwnerId).displayAvatarURL()).setDescription(`${interaction.guild.members.cache.get(data.TicketOwnerId).displayName} (${interaction.guild.members.cache.get(data.TicketOwnerId).id})`)
                        )
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            data.TicketSetup.TicketPermissions.map((permission) => {
                                const allowed = permission.AllowedDiscordPermissions
                                    ? new PermissionsBitField(permission.AllowedDiscordPermissions).toArray().join(", ")
                                    : "N/A";

                                const denied = permission.DeniedDiscordPermissions
                                    ? new PermissionsBitField(permission.DeniedDiscordPermissions).toArray().join(", ")
                                    : "N/A";

                                const roleOrUser = permission.DiscordRoleId
                                    ? `<@&${permission.DiscordRoleId}>`
                                    : `<@${permission.DiscordUserId}>`;
                                return [
                                    "",
                                    `> **Permission Id**: \`${permission.UUID}\``,
                                    `> **Role/User**: ${roleOrUser}`,
                                    `> **Permissions**:`,
                                    `> -# - Allowed: ${allowed}`,
                                    `> -# - Denied: ${denied}`,
                                    `> **Ticket Permissions**: ${permission.TicketPermissions.join(", ") || "N/A"}`,
                                    `> **Has Shadow-Ping**: ${permission.HasShadowPing ? "Yes" : "No"}`,
                                    `> **Is Ticket Mod**: ${permission.IsHandler ? "Yes" : "No"}`,
                                    ""
                                ].join("\n");
                            }).join("\n")
                        )
                    )


            ]
        })


    },
};
