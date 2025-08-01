import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    RoleSelectMenuBuilder,
    TextInputStyle
} from "discord.js";
import {VerificationAction} from "../../../enums/verification.js";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-verification-action-role",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("User does not exist");

        const uuid = interaction.customId.split(":")[1];
        const data = await database.verificationGates.findFirst({
            where: {
                UUID: uuid
            }
        });
        if (data?.Action == VerificationAction.AddPermissionToChannel) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} You have already selected a channel for this verification action.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.verificationGates.update(
            {
                where: {
                    UUID: data.UUID
                },
                data: {
                    Action: VerificationAction.AddRole,
                }
            }
        );

        return interaction.reply({
            components: [
                new ActionRowBuilder<RoleSelectMenuBuilder>()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId("security-gate-verification-action-role-select:" + interaction.customId.split(":")[1])
                            .setPlaceholder("Select a role to assign")
                            .setMinValues(1)
                            .setMaxValues(1)
                    )]
            ,
            flags: MessageFlags.Ephemeral,
        })
    }
};
