import {ButtonStyle, ComponentType, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-account-age-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        const input = interaction.fields.getTextInputValue("security-gate-account-age-input");

        if (!client.user) throw new Error("User is not logged in.");

        if (input === "" || isNaN(parseInt(input)) || parseInt(input) < 1 || parseInt(input) > 365) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} Please enter a valid number between 1 and 365 for the account age.`,
                flags: MessageFlags.Ephemeral
            })
        }

        await database.securitys.update
        ({
            where: {
                GuildId: interaction.guildId,
            }, data: {
                MaxAccountAge: parseInt(input)
            }
        });


        return interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Successfully set the minimum account age to **${input} days**.`,
            flags: MessageFlags.Ephemeral
        });

    }
};
