import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ContainerBuilder, MessageFlags,
    ModalBuilder,
    ModalSubmitInteraction, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {Config} from "../../../main/config.js";
import {VerificationActionType} from "../../../enums/verification.js";

export default {
    id: "security-gate-verification-components",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]

        const data = await database.verificationGates.findFirst({
            where: {
                UUID: uuid
            }
        })

        function getType() {

        }


        await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("puzzle")} Components V2`,
                                    ``,
                                    `-# If you want to use the module with the Components V2 from Message Templates you can just do it.`,
                                    `-# Please copy the IDs below and paste it in your Component Editor.`,
                                    ``,
                                    `**Button**:`,
                                    `- Custom Id: `,
                                    `  - \`${data.ActionType != VerificationActionType.Authorize ? `security-gate-verification-verify:${data?.UUID}` : `Using Authorize Type`}\``,
                                    `- Link Button:`,
                                    `  - \`${data.ActionType == VerificationActionType.Authorize ? ((Config.Modules.Verification.VerifyAuthUrl) + "&state=" + (data.UUID)) : `Link only for Authorize Type`}\``,
                                    ``,
                                    `-# Selectmenus are not used in this module.`
                                ].join("\n"))
                    )

            ]
        })
    }
};
