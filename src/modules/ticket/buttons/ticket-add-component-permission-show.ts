import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ContainerBuilder,
    MessageFlags,
    ModalBuilder,
    PermissionsBitField,
    RoleSelectMenuBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-permission-show",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();

        const uuid = interaction.customId.split(":")[1]
        const data = await database.ticketSetups.findFirst({
            include: {
                TicketPermissions: true
            },
            where: {
                CustomId: uuid
            }
        });

        const container = new ContainerBuilder()


        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`> ### Loaded ${data.TicketPermissions.length} Ticket Permission from ${data.CustomId}`)
        )

        const section = data.TicketPermissions.length >= 1 ? await Promise.all(data.TicketPermissions.map((permission) => {
                return new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    ``,
                                    `> **Permission Id**: \`${permission.UUID}\``,
                                    `> **Role/User**: ${permission.DiscordRoleId ? `<@&${permission.DiscordRoleId}>` : `<@${permission.DiscordUserId}>`}`,
                                    `> **Permissions**: `,
                                    `> -# - Allowed: ${permission.AllowedDiscordPermissions ? new PermissionsBitField(permission.AllowedDiscordPermissions).toArray().join(",") : "N/A"}`,
                                    `> -# - Denied: ${permission.DeniedDiscordPermissions ? new PermissionsBitField(permission.DeniedDiscordPermissions).toArray().join(",") : "N/A"}`,
                                    `> **Ticket Permissions**: ${permission.TicketPermissions.join(",")}`,
                                    `> **Has Shadow-Ping**: ${permission.HasShadowPing ? "Yes" : "No"}`,
                                    `> **Is Ticket Mod**: ${permission.IsHandler ? "Yes" : "No"}`,
                                    ``
                                ].join("\n")
                            )
                    )
                    .setButtonAccessory(
                        new ButtonBuilder().setCustomId("ticket-add-component-permission-remove:" + permission.UUID).setStyle(ButtonStyle.Secondary).setEmoji("<:trash:1259432932234367069>")
                    )
            })
        ) : null

        if (section) container.addSectionComponents(section)

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [container]
        })
    }
};
