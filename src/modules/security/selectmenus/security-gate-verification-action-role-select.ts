import {
    ActionRowBuilder,
    AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {DisbotInteractionType} from "../../../enums/disbotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-verification-action-role-select",
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
        const uuid = interaction.customId.split(":")[1];

        for (const value of interaction.values) {

            const data = await database.verificationGates.findFirst
            ({
                where: {
                    UUID: value
                }
            });

            if (!data) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user.id)} Verification Gate not found`,
                    flags: MessageFlags.Ephemeral
                });
            }

            if (!data.Roles.includes(value)) {
                data.Roles.push(value);
            } else {
                data.Roles = data.Roles.filter(role => role != value);
            }
            await database.verificationGates.update(
                {
                    where: {
                        UUID: value
                    },
                    data: {
                        Roles: data.Roles
                    }
                }
            );

            interaction.update({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Role has been ${data.Roles.includes(value) ? "added" : "removed"} to the security gate verification action.`,
            })
        }
    }
}

