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
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verification-action-role-select",
    type: DisBotInteractionType.SelectMenu,

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
                    UUID: uuid
                }
            });


            if (!data) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Verification Gate not found`, interaction, true, "reply")
            }

            if (!data.Roles.includes(value)) {
                data.Roles.push(value);
            } else {
                data.Roles = data.Roles.filter(role => role != value);
            }
            await database.verificationGates.update(
                {
                    where: {
                        UUID: uuid
                    },
                    data: {
                        Roles: data.Roles
                    }
                }
            );

            return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Role has been ${data.Roles.includes(value) ? "added" : "removed"} to the security gate verification action.`, interaction, true, "update")
        }
    }
}

