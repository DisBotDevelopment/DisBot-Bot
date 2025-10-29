import {ExtendedClient} from "../../../types/client.js"
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ActionRowBuilder, MessageFlags, ModalSubmitInteraction, StringSelectMenuBuilder,} from "discord.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verify-action-channel-modal",

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
        })

        const permissions = interaction.fields.getTextInputValue("permissions").split(",").map(perm => perm.trim());

        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No security gate verification action found for this modal.`, interaction, true, "reply")
        }

        await database.verificationGatesPermission.updateMany(
            {
                where: {
                    ChannelId: interaction.fields.getTextInputValue("channelId"),
                    VerificationGateId: data.UUID
                },
                data: {
                    Permission: {
                        set: permissions
                    }
                }
            },
        );
        
        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Security gate verification Channel action has been successfully added.`, interaction, true, "reply")
    }
};
