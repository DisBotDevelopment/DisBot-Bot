import {
    ActionRowBuilder,
    AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle,
    ColorResolvable,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits
} from "discord.js";
import {DisbotInteractionType} from "../../../enums/disbotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-verification-manage-select",
    type: DisbotInteractionType.SelectMenu,
    options: {
        once: false,
        permission: PermissionType.SecurityGate,
        cooldown: 3000, // 3 seconds
        botPermissions: [],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false
    },

    /**
     * @param {AnySelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: AnySelectMenuInteraction, client: ExtendedClient
    ) {
        if (!client.user) throw new Error("User does not exist");

        for (const value of interaction.values) {
            const data = await database.verificationGates.findFirst
            ({
                include: {
                    ChannelPermissions: true
                },
                where: {
                    UUID: value
                }
            });

            if (!data) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user.id)} No Verification Gate Found`,
                    flags: MessageFlags.Ephemeral
                });
            }

            const embed = {
                color: "#2B2D31",
                description: [
                    `## ${await convertToEmojiPng("verify", client.user.id)} Verification Gate Details`,
                    ``,
                    `**UUID:** ${data.UUID}`,
                    `**Channel ID:** ${data.ChannelId}`,
                    `**Message ID:** ${data.MessageId}`,
                    `**Action:** ${data.Action}`,
                    `**Action Type:** ${data.ActionType}`,
                    `**Permissions:** ${data.ChannelPermissions.map(p => p.Permission).join(", ") || "None"}`,
                    `**Roles:** ${data.Roles.length ? data.Roles.join(", ") : "None"}`,
                    `**Verified Users Count:** ${data.VerifiedUsers.length}`,
                    `**Created At:** ${new Date(data.CreatedAt).toLocaleDateString()}`,
                    `**Active:** ${data.Active ? "Yes" : "No"}`
                ].join("\n")
            };
            const actionRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`security-gate-verification-delete:${data.UUID}`)
                        .setLabel("Delete Verification Gate")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("<:trash:1259432932234367069>")
                );

            if (data.Active) {
                actionRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`security-gate-verification-deactivate:${data.UUID}`)
                        .setLabel("Deactivate Verification Gate")
                        .setEmoji("<:toggleoff:1301864526848987196>")
                        .setStyle(ButtonStyle.Secondary)
                );
            } else {
                actionRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`security-gate-verification-activate:${data.UUID}`)
                        .setLabel("Activate Verification Gate")
                        .setEmoji("<:toggleon:1301864515838672908>")
                        .setStyle(ButtonStyle.Secondary)
                );
            }

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(embed.color as ColorResolvable)
                    .setDescription(embed.description)
                ],
                components: [actionRow],
                flags: MessageFlags.Ephemeral
            });

        }
    }
}

