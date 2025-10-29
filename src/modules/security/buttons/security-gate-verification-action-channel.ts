import {VerificationAction, VerificationActionType} from "../../../enums/verification.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder, ComponentBuilder, ContainerBuilder,
    MessageFlags
} from "discord.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verification-action-channel",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not defined.");
        const uuid = interaction.customId.split(":")[1];

        const data = await database.verificationGates.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (data?.Action == VerificationAction.AddRole) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} You have already selected a role for this verification action.`, interaction, true, "reply")
        }

        await database.verificationGates.update(
            {
                where: {
                    UUID: interaction.customId.split(":")[1]
                },
                data: {
                    Action: VerificationAction.AddPermissionToChannel
                }
            }
        );


        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>()
                            .addComponents(
                                new ChannelSelectMenuBuilder()
                                    .setCustomId(`security-gate-verification-action-channel-selcet:${uuid}`)
                                    .setPlaceholder("Select a channel for the verification action")
                            ))
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        })
    }
}