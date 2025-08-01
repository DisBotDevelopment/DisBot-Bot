import {VerificationAction, VerificationActionType} from "../../../enums/verification.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    MessageFlags
} from "discord.js";
import {database} from "../../../main/database.js";

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
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} You have already selected a role for this verification action.`,
                flags: MessageFlags.Ephemeral,
            });
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


        interaction.reply({
            components: [
                new ActionRowBuilder<ChannelSelectMenuBuilder>()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId(`security-gate-verification-action-channel-selcet:${uuid}`)
                            .setPlaceholder("Select a channel for the verification action")
                    )
            ],
            flags: MessageFlags.Ephemeral,
        })
    }
}