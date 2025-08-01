import { VerificationAction } from "../../../enums/verification.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { verifyAction } from "../../../systems/verifictionAction.js";
import { ExtendedClient } from "../../../types/client.js"
import { GuildMember, MessageFlags, ModalSubmitInteraction, } from "discord.js";
import pkg from "short-uuid";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-verification-code",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not defined.");
        const uuid = interaction.customId.split(":")[1];

        const data = await database.verificationGates.findFirst({
            where: {
                UUID: uuid
            }
        });
        const code = interaction.customId.split(":")[2];
        const answer = interaction.fields.getTextInputValue("security-gate-verification-code-input");

        if (code !== answer) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} The verification code is incorrect.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const verify = await verifyAction(interaction.member as GuildMember, data?.Action as VerificationAction, uuid);

        if (verify == false) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("check", client.user?.id)} You unverified yourself! and removed all permissions and roles.`,
                flags: MessageFlags.Ephemeral
            });
        }

        interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} You have successfully completed the math verification!`,
            flags: MessageFlags.Ephemeral
        });
    }
};
