import {
    ActionRowBuilder,
    AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle, ContainerBuilder,
    MessageFlags,
    PermissionFlagsBits, TextDisplayBuilder
} from "discord.js";
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verification-select",
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

        for (const value of interaction.values) {
            const type = value.split(":")[0];
            const uuid = value.split(":")[1];

            const data = await database.verificationGates.findFirst({
                where: {
                    UUID: uuid
                }
            });

            if (!data)
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} There is no gate Setup with your ID`, interaction, true, "reply")

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
                components: [

                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(
                                    `## ${await convertToEmojiToPng("check")} Your Gate is Created, please follow the setup and set a Action.\n> After you have this setup you can click the Finish Button.`,
                                )
                        )
                        .addActionRowComponents(
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
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("security-gate-verification-button:" + uuid)
                                    .setEmoji("<:button:1377617783935991989>").setStyle(ButtonStyle.Secondary)
                                    .setDisabled(data.MessageId == "componentsv2")
                                    .setLabel("Customize Button"),
                                new ButtonBuilder()
                                    .setCustomId("security-gate-verification-reaction:" + uuid)
                                    .setEmoji("<:emoji:1327305922359332935>").setStyle(ButtonStyle.Secondary)
                                    .setDisabled(data.MessageId == "componentsv2")
                                    .setLabel("Set Reaction"),
                                new ButtonBuilder()
                                    .setCustomId("security-gate-verification-components:" + uuid)
                                    .setEmoji("<:puzzle:1381000302601441440>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(data.MessageId != "componentsv2")
                                    .setLabel("Components V2"),
                                new ButtonBuilder()
                                    .setEmoji("<:check:1275172002436481065>")
                                    .setLabel("Finish you Gate").setStyle(ButtonStyle.Secondary)
                                    .setCustomId("security-gate-verification-finish:" + uuid),
                            )
                        )
                ]
            })

        }
    }
}

