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
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verification-action-channel-selcet",
    type: DisBotInteractionType.SelectMenu,
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


            const data = await database.verificationGates
                .findFirst
                ({
                    include: {
                        ChannelPermissions: true
                    },
                    where: {
                        UUID: value
                    }
                });
            if (!data) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No security gate verification action found for this select menu.`, interaction, true, "reply")
            }

            if (data.ChannelPermissions.map((c) => c.ChannelId).includes(value)) {
                await database.verificationGatesPermission.deleteMany({
                    where: {
                        ChannelId: value,
                        VerificationGateId: value
                    },
                });
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Removed channel ${interaction.guild?.channels.cache.get(value)?.name} from the security gate verification action.`, interaction, true, "reply")
            }

            if (!interaction.guild?.channels.cache.get(value)) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Channel not found.`, interaction, true, "reply")
            }

            await database.verificationGatesPermission.create({
                data: {
                    ChannelId: value,
                    Permission: [],
                    VerificationGateId: data.UUID
                }
            });

            const modal = new ModalBuilder()
                .setCustomId(`security-gate-verify-action-channel-modal:${uuid}`)
                .setTitle("Set your permissions for the Channel");

            const permisionsString = new TextInputBuilder()
                .setCustomId("permissions")
                .setLabel("Permissions")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Enter the permissions you want to set for this channel, e.g. SendMessages,ViewChannel,etc.")
                .setMaxLength(1000);

            const channelId = new TextInputBuilder()
                .setCustomId("channelId")
                .setLabel("Channel ID")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setValue(value)
                .setPlaceholder("Not change this, if you don't know what to do here.")

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(permisionsString),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(channelId)
            );
            await interaction.showModal(modal);
        }
    }
}

