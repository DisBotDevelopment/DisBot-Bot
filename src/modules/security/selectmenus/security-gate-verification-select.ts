import {
    ActionRowBuilder,
    AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    PermissionFlagsBits
} from "discord.js";
import {DisbotInteractionType} from "../../../enums/disbotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-verification-select",
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
            const type = value.split(":")[0];
            const uuid = value.split(":")[1];

            const data = await database.verificationGates.findFirst({
                where: {
                    UUID: uuid
                }
            });

            if (!data) return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} There is no gate Setup with your ID`
            })

            await database.verificationGates.update
            ({
                    where: {
                        UUID: uuid
                    },
                    data: {
                        ActionType: type
                    }
                },
            )

            if (!client.user) throw new Error("User not found");
            await interaction.update({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Your Gate is Created, please follow the setup and set a Action.\n> After you have this setup you can click the Finish Button.`,
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("security-gate-verification-action-role:" + uuid)
                            .setEmoji("<:role:1335667919119585480>")
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel("Add a Role"),
                        new ButtonBuilder()
                            .setEmoji("<:permissions:1277170947761111130>")
                            .setLabel("Add a Permissions to a Channel").setStyle(ButtonStyle.Secondary)
                            .setCustomId("security-gate-verification-action-channel:" + uuid)
                    ),
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("security-gate-verification-button:" + uuid)
                            .setEmoji("<:button:1377617783935991989>").setStyle(ButtonStyle.Secondary)
                            .setLabel("Customize Button"),
                        new ButtonBuilder()
                            .setCustomId("security-gate-verification-reaction:" + uuid)
                            .setEmoji("<:emoji:1327305922359332935>").setStyle(ButtonStyle.Secondary)
                            .setLabel("Set Reaction"),
                        new ButtonBuilder()
                            .setEmoji("<:check:1275172002436481065>")
                            .setLabel("Finish you Gate").setStyle(ButtonStyle.Secondary)
                            .setCustomId("security-gate-verification-finish:" + uuid),
                    )
                ]
            })

        }
    }
}

